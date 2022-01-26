import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface Props {
  text?: string
  onPress?: () => void
  icon: string
}

const ActionBarItem: React.FC<Props> = ({ text, onPress, icon }) => {
  return <TouchableOpacity style={styles.container}
                           onPress={onPress}>
    <FontAwesome5Icon name={icon}
                      style={styles.icon} />
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  icon: {
    fontSize: 34,
    paddingVertical: 2
  },
  text: {
    fontSize: 14
  }
});

export default ActionBarItem;
