import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import Bluetooth, { Characteristic, Peripheral } from "./logic/bluetooth";
import DeviceHitStatus from "./DeviceHitStatus";
import DeviceHitReset from "./DeviceHitReset";

enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
}

interface ScreenProps {
  device?: Peripheral;
  disconnect: () => void;
}

const DeviceScreen: React.FC<ScreenProps> = ({ device, disconnect }) => {
  const [connectionState, setConnectionState] = useState(ConnectionState.Disconnected);

  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const onLaunch = () => {
    Bluetooth.emitter.addListener("BleManagerConnectPeripheral", onDeviceConnect);
    Bluetooth.emitter.addListener("BleManagerDisconnectPeripheral", onDeviceDisconnect);
    Bluetooth.emitter.addListener("BleManagerPeripheralDidBond", onDeviceDidBond);
    Bluetooth.emitter.addListener("BleManagerDidUpdateValueForCharacteristic", onDeviceSentValue);
  };

  const onExit = () => {
    Bluetooth.emitter.removeAllListeners("BleManagerConnectPeripheral");
    Bluetooth.emitter.removeAllListeners("BleManagerDisconnectPeripheral");
    Bluetooth.emitter.removeAllListeners("BleManagerPeripheralDidBond");
    Bluetooth.emitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic");
  };

  const onDeviceConnect = (data: { peripheral: string, status: number }) => {
    setConnectionState(ConnectionState.Connected);
    retrieveServices();
  };

  const onDeviceDisconnect = (data: { peripheral: string, status: number }) => {
    setConnectionState(ConnectionState.Disconnected);
  };

  const onDeviceDidBond = (data: any) => {
    console.log("onDeviceDidBond", data);
  };

  const onDeviceSentValue = (data: { value: Array<any>, id: string, characteristic: string, service: string }) => {
    console.log("onDeviceSentValue", {
      value: data.value,
      id: data.id,
      characteristic: data.characteristic,
      service: data.service
    });
  };

  useEffect(() => {
    connect();
    return () => setConnectionState(ConnectionState.Disconnected);
  }, [device]);

  const connect = () => {
    if (device === undefined) {
      return;
    }

    console.log("Connecting to device...");
    setConnectionState(ConnectionState.Connecting);
    Bluetooth.manager.connect(device.id)
      .then(() => {
      })
      .catch((error: any) => {
        console.error("Failed to connect to device", error);
        if (connectionState != ConnectionState.Connected) {
          setConnectionState(ConnectionState.Disconnected);
        }
      });
  };

  const retrieveServices = () => {
    if (device === undefined) {
      return;
    }

    Bluetooth.manager.retrieveServices(device.id)
      .then((data: (Peripheral & { characteristics: Characteristic[], services: Array<{ uuid: string }> })) => {
        console.log("Retrieved services. Ready for data transmission.");
      })
      .catch((error: any) => {
        console.error("Failed to retrieve services from device", error);
      });
  };

  if (device === undefined) {
    return <View style={styles.container}>
      <Text>Select a device to start a connection</Text>
    </View>;
  }

  return <View style={styles.container}>
    <Text>{device.name}</Text>
    <Text>
      {connectionState !== ConnectionState.Disconnected ? undefined : "Not connected"}
      {connectionState !== ConnectionState.Connecting ? undefined : "Connecting..."}
      {connectionState !== ConnectionState.Connected ? undefined : "Connected"}
    </Text>

    {connectionState !== ConnectionState.Connected ? undefined : <DeviceHitReset device={device} />}
    {connectionState !== ConnectionState.Connected ? undefined : <DeviceHitStatus device={device} />}
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default DeviceScreen;
