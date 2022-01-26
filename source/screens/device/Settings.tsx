import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import Bluetooth, { Peripheral } from "../../logic/bluetooth";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { stringToBytes } from "../../logic/utils";
import Config from "../../config";
import LoadingOverlay from "../utils/LoadingOverlay";

interface Props {
  device?: Peripheral;
  close?: () => void;
}

const Settings: React.FC<Props> = ({ device, close }) => {
  const [force, setForce] = useState("800");
  const [brightness, setBrightness] = useState("255");
  const [pollInterval, setPollInterval] = useState(Config.pollInterval.toString());
  const [isSaving, setIsSaving] = useState(false);

  const save = () => {
    setIsSaving(true);
    Config.pollInterval = +pollInterval;

    send("force;" + force)
      .then(() => send("bright;" + brightness))
      .then(() => {
        setIsSaving(false);
        close?.()
      });
  };

  const send = (text: string): Promise<any> => {
    console.log("Saving: ", text);
    if (device === undefined) {
      return new Promise((resolve) => resolve(undefined));
    }

    const data = stringToBytes(text);
    return Bluetooth.manager.write(device.id, Config.service, Config.characteristic, data)
      .catch((error: any) => {
        console.error("Failed to write to device", error);
      });
  };

  return <View style={styles.container}>
    <LoadingOverlay isVisible={isSaving} />

    <View style={styles.card}>
      <View style={styles.title}>
        <FontAwesome5Icon name={"cog"} style={styles.titleIcon} />
        <Text style={styles.titleText}>
          Settings
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Force threshold</Text>
          <TextInput style={styles.itemInput}
                     value={force}
                     onChangeText={setForce}
                     keyboardType={"numeric"} />
        </View>

        <View style={styles.item}>
          <Text style={styles.itemLabel}>Brightness</Text>
          <TextInput style={styles.itemInput}
                     value={brightness}
                     onChangeText={setBrightness}
                     keyboardType={"numeric"} />
        </View>

        <View style={styles.item}>
          <Text style={styles.itemLabel}>Poll interval (ms)</Text>
          <TextInput style={styles.itemInput}
                     value={pollInterval}
                     onChangeText={setPollInterval}
                     keyboardType={"numeric"} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.footerButtonLeft]}
                          onPress={close}>
          <Text style={[styles.footerButtonText, styles.footerButtonTextLeft]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton, styles.footerButtonRight]}
                          onPress={save}>
          <Text style={[styles.footerButtonText, styles.footerButtonTextRight]}>Save</Text>
        </TouchableOpacity>
      </View>


    </View>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#0004",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "stretch",
    zIndex: 9,
    paddingTop: 20,
    paddingBottom: 70,
    paddingHorizontal: 30
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5
  },

  title: {
    backgroundColor: "#0001",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15
  },
  titleIcon: {
    fontSize: 16,
    paddingHorizontal: 10
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingRight: 30
  },

  content: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: "#00000003"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemLabel: {
    flex: 1
  },
  itemInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },

  footer: {
    flexDirection: "row",
    alignItems: "stretch",
    height: 50,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  footerButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#fff"
  },
  footerButtonLeft: {
    borderBottomLeftRadius: 5
  },
  footerButtonRight: {
    borderBottomRightRadius: 5,
    borderRightWidth: 0,
    backgroundColor: "dodgerblue"
  },
  footerButtonText: {
    textAlign: "center",
    fontSize: 16
  },
  footerButtonTextLeft: {},
  footerButtonTextRight: {
    color: "#fff"
  }
});

export default Settings;
