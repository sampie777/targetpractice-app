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
  let _isMounted = false;

  useEffect(() => {
    onLaunch();
    return onExit;
  }, []);

  const onLaunch = () => {
    _isMounted = true;
    Bluetooth.emitter.addListener("BleManagerStopScan", onScanningStopped);
    Bluetooth.emitter.addListener("BleManagerDiscoverPeripheral", onDeviceFound);
    startScan();
  };

  const onExit = () => {
    Bluetooth.emitter.removeAllListeners("BleManagerStopScan");
    Bluetooth.emitter.removeAllListeners("BleManagerDiscoverPeripheral");
    stopScan();
    _isMounted = false;
  };

  const startScan = () => {
    if (isScanning) {
      return;
    }

    setDevices([]);
    Bluetooth.manager.scan([], 10, true)
      .then(() => {
        if (!_isMounted) {
          return;
        }
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
    <Text style={styles.headerText}>Nearby devices</Text>
    <FlatList data={devices}
              contentContainerStyle={styles.list}
              renderItem={renderDeviceItem}
              keyExtractor={item => item.id} />
    <TouchableOpacity onPress={toggleScan}
                      style={styles.button}>
      <Text style={styles.buttonText}>
        {isScanning ? "Scanning... (click to stop)" : "Scan"}
      </Text>
    </TouchableOpacity>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0000000a",
  },
  headerText: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 2,
    backgroundColor: "#fff",
    textAlign: "center",
  },

  list: {
    flex: 1,
  },
  item: {
    marginBottom: 1,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16
  },
  itemId: {},

  button: {
    backgroundColor: "dodgerblue"
  },
  buttonText: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    textAlign: "center",
    color: "#fff",
    fontSize: 18
  },
});

export default DeviceList;
