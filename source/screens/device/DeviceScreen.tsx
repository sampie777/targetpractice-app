import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import Bluetooth, { Characteristic, Peripheral } from "../../logic/bluetooth";
import DeviceHitStatus from "./DeviceHitStatus";
import DeviceStatus from "./DeviceStatus";
import LoadingOverlay from "../utils/LoadingOverlay";
import ActionBar from "./ActionBar";
import Settings from "./Settings";

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
  const [showSettings, setShowSettings] = useState(false);

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
    disconnect();
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

  const getConnectionText = () => {
    switch (connectionState) {
      case ConnectionState.Disconnected:
        return "Not connected";
      case ConnectionState.Connecting:
        return "Connecting...";
      case ConnectionState.Connected:
        return "Connected";
    }
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  if (device === undefined) {
    return <View style={styles.container}>
      <Text>Select a device to start a connection</Text>
    </View>;
  }

  return <View style={styles.container}>
    {!showSettings ? undefined :
      <Settings device={device} close={closeSettings} />}

    <DeviceStatus device={device}
                  disconnect={disconnect}
                  openSettings={() => setShowSettings(true)} />

    <View style={styles.content}>
      <LoadingOverlay isVisible={connectionState !== ConnectionState.Connected}
                      text={getConnectionText()} />

      {connectionState !== ConnectionState.Connected
        ? <View style={{ flex: 1 }} />
        : <DeviceHitStatus device={device} disconnect={disconnect} />}

      <ActionBar device={device} />
    </View>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  }
});

export default DeviceScreen;
