import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ActionBarItem from "./ActionBarItem";
import { Exercise } from "../../logic/exercises/Exercise";
import { ReactionTimeExercise } from "../../logic/exercises/ReactionTimeExercise";
import { DeviceState } from "../../logic/DeviceState";

interface Props {
  deviceState?: DeviceState,
  exercise?: Exercise,
  setExercise: (exercise?: Exercise) => void,
}

const ActionBar: React.FC<Props> = ({ deviceState, exercise, setExercise }) => {
  useEffect(() => {
    return () => {
      exercise?.stop();
    };
  }, [exercise]);

  const onItemClick = (clazz: any) => {
    if (exercise !== undefined && exercise instanceof clazz) {
      exercise.stop();
      setExercise(undefined);
      return;
    }

    if (deviceState === undefined) {
      return;
    }

    const newExercise = new clazz(deviceState) as Exercise;
    newExercise.start();
    setExercise(newExercise);
  };

  return <View style={styles.container}>
    <ActionBarItem text={"Reaction time"}
                   icon={"stopwatch"}
                   highlighted={exercise instanceof ReactionTimeExercise}
                   onPress={() => onItemClick(ReactionTimeExercise)} />
    <ActionBarItem text={"item 2"}
                   icon={"random"} />
    <ActionBarItem text={"item 3"}
                   icon={"layer-group"} />
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
    alignItems: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff"
  }
});

export default ActionBar;
