import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface Props {
  text?: string;
  onPress?: () => void;
  icon: string;
  highlighted?: boolean;
}

const ActionBarItem: React.FC<Props> = ({ text, onPress, icon, highlighted = false }) => {
  return <TouchableOpacity style={[styles.container, (highlighted ? styles.containerHighlight : {})]}
                           onPress={onPress}>
    <FontAwesome5Icon name={icon}
                      style={[styles.icon, (highlighted ? styles.textHighlight : {})]} />
    <Text style={[styles.text, (highlighted ? styles.textHighlight : {})]}>{text}</Text>
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
  containerHighlight: {
    backgroundColor: "dodgerblue"
  },
  icon: {
    fontSize: 34,
    paddingVertical: 2
  },
  text: {
    fontSize: 14
  },
  textHighlight: {
    color: "#fff"
  }
});

export default ActionBarItem;
