import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Bluetooth, { Peripheral } from "./logic/bluetooth";
import Config from "./config";
import { bytesToString } from "./logic/utils";

enum Status {
  Ready,
  Hit,
  Unknown,
}

interface ScreenProps {
  device: Peripheral;
}

const DeviceHitStatus: React.FC<ScreenProps> = ({ device }) => {
  const [status, setStatus] = useState(Status.Unknown);

  let _timer: any = null;

  useEffect(() => {
    _timer = setInterval(requestHitData, Config.pollInterval);
    return stopPolling;
  }, []);

  const stopPolling = () => {
    if (_timer == null) {
      return;
    }
    clearInterval(_timer);
  }

  const requestHitData = () => {
    Bluetooth.manager.read(device.id, Config.service, Config.characteristic)
      .then((data: Uint8Array) => {
        const text = bytesToString(data);
        processReceivedData(text);
      })
      .catch((error: any) => {
        if (error == "Device is not connected") {
          stopPolling();
          return;
        }
        console.error("Failed to read from device", error);
      });
  };

  const processReceivedData = (data: string) => {
    if (data === "hit") {
      setStatus(Status.Hit);
    } else {
      setStatus(Status.Ready);
    }
  };

  return <View style={styles.container}>
    <Button title={"Refresh"} onPress={requestHitData} />
    <View style={[
      styles.status,
      (status !== Status.Ready ? {} : styles.statusReady),
      (status !== Status.Hit ? {} : styles.statusHit)
    ]}>
      <Text style={styles.statusText}>
        {status === Status.Hit ? "HIT" : undefined}
        {status === Status.Ready ? "ready" : undefined}
        {status === Status.Unknown ? "unknown" : undefined}
      </Text>
    </View>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  status: {
    flex: 1,
    backgroundColor: "#777",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  statusReady: {
    backgroundColor: "#6cb26c"
  },
  statusHit: {
    backgroundColor: "#f00"
  },
  statusText: {
    fontSize: 40,
    color: "#fff"
  }
});

export default DeviceHitStatus;
