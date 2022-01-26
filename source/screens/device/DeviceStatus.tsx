import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Peripheral } from "../../logic/bluetooth";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface Props {
  device: Peripheral;
  disconnect: () => void;
  openSettings?: () => void;
}

const DeviceStatus: React.FC<Props> = ({ device, disconnect, openSettings }) => {
  return <View style={styles.container}>
    <TouchableOpacity onPress={disconnect}
                      style={styles.button}>
      <FontAwesome5Icon name={"sign-out-alt"}
                        style={styles.disconnectIcon} />
    </TouchableOpacity>

    <Text style={styles.nameText}>{device.name}</Text>

    <TouchableOpacity onPress={openSettings}
                      style={styles.button}>
      <FontAwesome5Icon name={"cog"}
                        style={styles.settingsIcon} />
    </TouchableOpacity>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#00000008",
    borderWidth: 1,
    borderColor: "#0002",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 13,
    justifyContent: "center",
    marginHorizontal: 10
  },
  disconnectIcon: {
    transform: [{ rotate: "180deg" }],
    fontSize: 18,
    marginLeft: -2
  },
  settingsIcon: {
    fontSize: 18
  },

  nameText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default DeviceStatus;
