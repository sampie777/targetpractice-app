import React, { useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import ActionBarItem from "./ActionBarItem";
import { Exercise } from "../../logic/exercises/Exercise";
import { ReactionTimeExercise } from "../../logic/exercises/ReactionTimeExercise";
import { DeviceState } from "../../logic/DeviceState";
import { QuickSixExercise } from "../../logic/exercises/QuickSixExercise";

const ExerciseItem: React.FC<{
  clazz: typeof Exercise,
  exercise?: Exercise,
  onPress?: (clazz: typeof Exercise) => void;
  onLongPress?: (clazz: typeof Exercise) => void;
  icon: string;
}> = ({
        clazz,
        exercise,
        onPress,
        onLongPress,
        icon
      }) =>
  <ActionBarItem text={clazz.title}
                 icon={icon}
                 highlighted={exercise instanceof clazz}
                 onPress={() => onPress?.(clazz)}
                 onLongPress={() => onLongPress?.(clazz)} />;

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

  const onDisable = () => {
    exercise?.stop();
    setExercise(undefined);
  };

  const onItemPress = (clazz: any) => {
    if (exercise !== undefined && exercise instanceof clazz) {
      exercise.stop();
      setExercise(undefined);
      return;
    }

    if (deviceState === undefined) {
      return;
    }

    const newExercise = new clazz(deviceState, onDisable) as Exercise;
    newExercise.start();
    setExercise(newExercise);
  };

  const onItemLongPress = (clazz: typeof Exercise) => {
    if (clazz.description.length === 0) {
      return;
    }
    Alert.alert(clazz.title, clazz.description);
  };

  return <View style={styles.container}>
    <ExerciseItem exercise={exercise}
                  clazz={ReactionTimeExercise}
                  icon={"stopwatch"}
                  onPress={onItemPress}
                  onLongPress={onItemLongPress} />
    <ExerciseItem exercise={exercise}
                  clazz={QuickSixExercise}
                  icon={"layer-group"}
                  onPress={onItemPress}
                  onLongPress={onItemLongPress} />
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
