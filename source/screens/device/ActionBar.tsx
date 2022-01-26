import React from "react";
import { StyleSheet, View } from "react-native";
import { Peripheral } from "../../logic/bluetooth";
import ActionBarItem from "./ActionBarItem";

interface Props {
  device: Peripheral;
}

const ActionBar: React.FC<Props> = ({ device }) => {
  return <View style={styles.container}>
    <ActionBarItem text={"item 1"} icon={"stopwatch"} />
    <ActionBarItem text={"item 2"} icon={"random"} />
    <ActionBarItem text={"item 3"} icon={"layer-group"} />
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
    alignItems: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  }
});

export default ActionBar;
