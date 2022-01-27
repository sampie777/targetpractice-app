import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Peripheral } from "../../logic/bluetooth";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { DeviceData, DeviceState, TargetStatus } from "../../logic/DeviceState";

interface ScreenProps {
  device: Peripheral;
  deviceState?: DeviceState;
}

const DeviceHitStatus: React.FC<ScreenProps> = ({ device, deviceState }) => {
  const [status, setStatus] = useState(TargetStatus.Unknown);
  const [hitForce, setHitForce] = useState("");
  const [hitDuration, setHitDuration] = useState("");

  useEffect(() => {
    deviceState?.addEventListener(onDeviceUpdated);
    return () => deviceState?.removeEventListener(onDeviceUpdated);
  }, [deviceState]);

  const onDeviceUpdated = ({ targetStatus, hitForce, hitDuration }: DeviceData) => {
    setStatus(targetStatus);
    setHitForce(hitForce);
    setHitDuration(hitDuration);
  };

  return <TouchableOpacity onPress={deviceState?.resetTarget} style={[
    styles.container,
    (status !== TargetStatus.Disabled ? {} : styles.statusDisabled),
    (status !== TargetStatus.Ready ? {} : styles.statusReady),
    (status !== TargetStatus.Hit ? {} : styles.statusHit)
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

    {status === TargetStatus.Disabled || status === TargetStatus.Unknown ? undefined :
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
    color: "#fff"
  },
  statusHitForceIcon: {
    fontSize: 12
  },
  statusHitDuration: {
    fontSize: 28,
    color: "#fff"
  },
  statusHitDurationIcon: {
    fontSize: 22
  },

  image: {
    flex: 1
  }
});

export default DeviceHitStatus;
