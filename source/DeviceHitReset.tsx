import React from "react";
import { Button, StyleSheet, View } from "react-native";
import Bluetooth, { Peripheral } from "./logic/bluetooth";
import Config from "./config";
import { stringToBytes } from "./logic/utils";

interface Props {
  device: Peripheral;
}

const DeviceHitReset: React.FC<Props> = ({ device }) => {

  const reset = () => {
    send("on");
  }

  const set = () => {
    send("off");
  }

  const send = (text: string) => {
    const data = stringToBytes(text);
    Bluetooth.manager.write(device.id, Config.service, Config.characteristic, data)
      .then(() => {
      })
      .catch((error: any) => {
        console.error("Failed to write to device", error);
      });
  }

  return <View style={styles.container}>
    <Button title={"Set"} onPress={set} />
    <Button title={"Reset"} onPress={reset} />
  </View>;
};

const styles = StyleSheet.create({
  container: {
  }
});

export default DeviceHitReset;
