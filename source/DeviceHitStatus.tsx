import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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
  const [hitForce, setHitForce] = useState("");

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
  };

  const requestHitData = () => {
    Bluetooth.manager.read(device.id, Config.service, Config.characteristic)
      .then((data: Uint8Array) => {
        const text = bytesToString(data);
        processReceivedData(text);
      })
      .catch((error: any) => {
        if (error == "Device is not connected" || error == "Device disconnected") {
          stopPolling();
          return;
        }
        console.error("Failed to read from device", error);
      });
  };

  const processReceivedData = (data: string) => {
    if (!data.startsWith("hit")) {
      setStatus(Status.Ready);
      setHitForce("");
      return;
    }

    setStatus(Status.Hit);
    if (data.includes(";")) {
      setHitForce(data.split(";")[1]);
    }
  };

  return <View style={styles.container}>
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
      <Text style={styles.statusHitForce}>{hitForce}</Text>
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
  },
  statusHitForce: {
    fontSize: 20,
    color: "#fff"
  }
});

export default DeviceHitStatus;
