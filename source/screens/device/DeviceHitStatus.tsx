import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import Bluetooth, { Peripheral } from "../../logic/bluetooth";
import Config from "../../config";
import { bytesToString, format, stringToBytes } from "../../logic/utils";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

enum Status {
  Disabled,
  Ready,
  Hit,
  Unknown,
}

interface ScreenProps {
  device: Peripheral;
  disconnect: () => void;
}

const DeviceHitStatus: React.FC<ScreenProps> = ({ device, disconnect }) => {
  const [status, setStatus] = useState(Status.Unknown);
  const [hitForce, setHitForce] = useState("");
  const [hitDuration, setHitDuration] = useState("");

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
        disconnect();
      });
  };

  const processReceivedData = (data: string) => {
    if (data.startsWith("hit")) {
      setStatus(Status.Hit);
      if (data.includes(";")) {
        const measurements = data.split(";");
        setHitForce(measurements[1]);
        if (measurements.length > 2) {
          const durationMs = measurements[2];
          const durationFormatted = format(new Date(+durationMs), "%M:%SS.%f");
          setHitDuration(durationFormatted);
        }
      }
      return;
    }

    setHitForce("");
    setHitDuration("");

    if (data === "on") {
      setStatus(Status.Ready);
    } else if (data === "off") {
      setStatus(Status.Disabled);
    } else {
      setStatus(Status.Unknown);
    }
  };

  const reset = () => {
    send("on");
  };

  const set = () => {
    send("off");
  };

  const send = (text: string) => {
    const data = stringToBytes(text);
    Bluetooth.manager.write(device.id, Config.service, Config.characteristic, data)
      .catch((error: any) => {
        console.error("Failed to write to device", error);
      });
  };

  return <TouchableOpacity onPress={reset} style={[
    styles.container,
    (status !== Status.Disabled ? {} : styles.statusDisabled),
    (status !== Status.Ready ? {} : styles.statusReady),
    (status !== Status.Hit ? {} : styles.statusHit)
  ]}>
    <Text style={styles.statusHitForce}>{hitForce === "" ? undefined :
      <>
        <FontAwesome5Icon name={"hammer"} style={styles.statusHitForceIcon} />&nbsp;
        {hitForce}
      </>}
    </Text>
    <Text style={styles.statusHitDuration}>{hitDuration === "" ? undefined :
      <>
        <FontAwesome5Icon name={"clock"} style={styles.statusHitDurationIcon} />&nbsp;
        {hitDuration}
      </>}
    </Text>

    {status === Status.Disabled || status === Status.Unknown ? undefined :
      <Image source={require("../../resources/target.png")}
             style={[styles.image, { width: Dimensions.get("window").width - 50 }]}
             resizeMode={"center"} />
    }
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#777",
    textAlign: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10
  },
  statusDisabled: {
    backgroundColor: "#0001"
  },
  statusReady: {
    backgroundColor: "#0001"
  },
  statusHit: {
    backgroundColor: "#6cb26c"
  },

  statusHitForce: {
    fontSize: 16,
    color: "#fff",
  },
  statusHitForceIcon: {
    fontSize: 12,
  },
  statusHitDuration: {
    fontSize: 28,
    color: "#fff"
  },
  statusHitDurationIcon: {
    fontSize: 22,
  },

  image: {
    flex: 1
  }
});

export default DeviceHitStatus;
