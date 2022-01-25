/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Bluetooth, { Peripheral } from "./logic/bluetooth";
import DeviceList from "./DeviceList";
import DeviceScreen from "./DeviceScreen";

const App: React.FC = () => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | undefined>(undefined);

  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const onLaunch = () => {
    Bluetooth.emitter.addListener("BleManagerDidUpdateState", onStateUpdated);
  };

  const onExit = () => {
    Bluetooth.emitter.removeAllListeners("BleManagerDidUpdateState");
  };

  const onStateUpdated = ({ state }: { state: "on" | "off" | "turning_on" | "turning_off" }) => {
    if (state === "off") {
      Alert.alert("Bluetooth", "Please turn on your bluetooth");
    }
    setIsBluetoothEnabled(state === "on");
  };

  const connectToDevice = (device: Peripheral) => {
    if (connectedDevice !== undefined && device.id === connectedDevice.id) {
      return disconnectFromCurrentDevice();
    }

    setConnectedDevice(device)
  }

  const disconnectFromCurrentDevice = () => {
    if (connectedDevice === undefined) {
      return;
    }

    return Bluetooth.manager.disconnect(connectedDevice.id)
      .then(() => {
        console.log("Disconnected from the device");
        setConnectedDevice(undefined);
      })
      .catch((error: any) => {
        console.error("Failed to disconnect from device", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DeviceList onDeviceClick={connectToDevice} />
      <DeviceScreen device={connectedDevice}
                    disconnect={disconnectFromCurrentDevice} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
