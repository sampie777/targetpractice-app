/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import {
  Alert, BackHandler, PermissionsAndroid,
  Text,
  SafeAreaView,
  StyleSheet
} from "react-native";
import Bluetooth, { Peripheral } from "./logic/bluetooth";
import DeviceList from "./screens/DeviceList";
import DeviceScreen from "./screens/device/DeviceScreen";

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | undefined>(undefined);

  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const onLaunch = () => {
    Bluetooth.emitter.addListener("BleManagerDidUpdateState", onStateUpdated);
    requestPermission();
  };

  const onExit = () => {
    Bluetooth.emitter.removeAllListeners("BleManagerDidUpdateState");
  };

  const requestPermission = () => {
    console.debug("Requesting permissions");
    PermissionsAndroid.requestMultiple(
      [
        // PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,   // Doesn't give popup so probs not needed
        // PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,    // Doesn't give popup so probs not needed
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]
    )
      .then((granted: object) => {
        const allGranted = Object.values(granted)
          .every(it => it === PermissionsAndroid.RESULTS.GRANTED);

        setHasPermission(allGranted);

        if (allGranted) {
          return;
        }
        Alert.alert(
          "Requires permission",
          "In order to use bluetooth to search for the target hardware, you need to give the Fine Location Access permission. ",
          [
            {
              text: "Close app",
              onPress: () => BackHandler.exitApp()
            }
          ]);
      })
      .catch((e: any) => {
        console.error("Failed to request permission", e);
      });
  };

  const onStateUpdated = ({ state }: { state: "on" | "off" | "turning_on" | "turning_off" }) => {
    if (state === "off") {
      Alert.alert("Bluetooth", "Please turn on your bluetooth");
    }
    setIsBluetoothEnabled(state === "on");
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [connectedDevice]);

  const onBackPress = (): boolean => {
    if (connectedDevice === undefined) {
      return false;
    }

    disconnectFromCurrentDevice();
    return true;
  };

  const connectToDevice = (device: Peripheral) => {
    if (connectedDevice !== undefined && device.id === connectedDevice.id) {
      return disconnectFromCurrentDevice();
    }

    setConnectedDevice(device);
  };

  const disconnectFromCurrentDevice = () => {
    if (connectedDevice === undefined) {
      setConnectedDevice(undefined);
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
      {hasPermission ? undefined : <>
        <Text style={styles.permissionError}>This app needs permission to use bluetooth.</Text>
        <Text style={styles.permissionError}>Please enable the location permissions for this app in your settings. </Text>
      </>}

      {!hasPermission ? undefined : <>
        {connectedDevice !== undefined ? undefined :
          <DeviceList onDeviceClick={connectToDevice} />}

        {connectedDevice === undefined ? undefined :
          <DeviceScreen device={connectedDevice}
                        disconnect={disconnectFromCurrentDevice} />}
      </>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0000000a",
    flexDirection: "column",
    justifyContent: "center",
  },
  permissionError: {
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
  }
});

export default App;
