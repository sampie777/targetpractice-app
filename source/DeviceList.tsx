import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from "react-native";
import Bluetooth, { Peripheral } from "./logic/bluetooth";

interface ScreenProps {
  onDeviceClick?: (device: Peripheral) => void;
}

const DeviceList: React.FC<ScreenProps> = ({ onDeviceClick }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Peripheral[]>([]);
  const devicesMap = new Map();

  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const onLaunch = () => {
    Bluetooth.emitter.addListener("BleManagerStopScan", onScanningStopped);
    Bluetooth.emitter.addListener("BleManagerDiscoverPeripheral", onDeviceFound);
  };

  const onExit = () => {
    Bluetooth.emitter.removeAllListeners("BleManagerStopScan");
    Bluetooth.emitter.removeAllListeners("BleManagerDiscoverPeripheral");
  };

  const startScan = () => {
    setDevices([]);
    Bluetooth.manager.scan([], 10, true)
      .then(() => {
        setIsScanning(true);
      });
  };

  const stopScan = () => {
    Bluetooth.manager.stopScan()
      .then(() => {
        setIsScanning(false);
      });
  };

  const toggleScan = () => {
    isScanning ? stopScan() : startScan();
  };

  const onScanningStopped = () => {
    setIsScanning(false);
  };

  const onDeviceFound = (device: Peripheral) => {
    addDevice(device);
  };

  const addDevice = (device: Peripheral) => {
    devicesMap.set(device.id, device);
    setDevices(Array.from(devicesMap.values()));
  };

  const onClick = (device: Peripheral) => {
    stopScan();
    onDeviceClick?.(device)
  }

  const renderDeviceItem = ({ item }: { item: Peripheral }) => {
    return <TouchableOpacity style={styles.item}
                             onPress={() => onClick?.(item)}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemId}>{item.id}</Text>
    </TouchableOpacity>;
  };

  return <View style={styles.container}>
    <TouchableOpacity onPress={toggleScan}
                      style={styles.button}>
      <Text style={styles.buttonText}>
        {isScanning ? "Scanning... (click to stop)" : "Scan"}
      </Text>
    </TouchableOpacity>

    <FlatList data={devices}
              contentContainerStyle={styles.list}
              renderItem={renderDeviceItem}
              keyExtractor={item => item.id} />
  </View>;
};

const styles = StyleSheet.create({
  container: {},
  button: {
    backgroundColor: "dodgerblue"
  },
  buttonText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    color: "#fff",
    fontSize: 18
  },
  list: {},
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16
  },
  itemId: {}
});

export default DeviceList;
