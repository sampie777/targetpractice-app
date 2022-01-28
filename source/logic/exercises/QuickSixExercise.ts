import { Exercise } from "./Exercise";
import { DeviceData, TargetStatus } from "../DeviceState";
import { Alert } from "react-native";
import { format } from "../utils";

interface Hit {
  force: number;
  time: number;
}

export class QuickSixExercise extends Exercise {
  private readonly targetResetTimeout = 200;
  private readonly exerciseStartMinimumTimeout = 4000;
  private readonly exerciseStartMaximumTimeout = 8000;
  private isStepping = false;
  private isHit = false;
  private timer: any = null;

  private readonly maxHitCount = 6;
  private exerciseStartTime: Date | undefined = undefined;
  private hits: Hit[] = [];

  static readonly title = "Quick Six";
  static readonly description =
    "This is a six shot exercise. The goal is to shot six shots on target as quickly as possible. \n" +
    "\n" +
    "1. When activated, the target will go dark for an random amount of time. \n" +
    "2. When the target turns on, you have to shoot it as quick as you can. \n" +
    "3. The target will turn on again quickly so you can place your next shot. \n" +
    "4. After six shots, a summary will be shown on screen. \n" +
    "\n" +
    "To start over during the exercise, just tap the screen.";

  start = () => {
    this.deviceState.addEventListener(this.onHitStateUpdated);
    this.deviceState.disableTarget();
    this.timer = setTimeout(
      () => this.step(),
      Math.random() * (this.exerciseStartMaximumTimeout - this.exerciseStartMinimumTimeout) + this.exerciseStartMinimumTimeout
    );
  };

  stop = (resetTarget: boolean = true) => {
    this.deviceState.removeEventListener(this.onHitStateUpdated);
    this.stopTimer();
    // Only reset target when exercise not finished (as the finish should also reset it)
    if (resetTarget && this.hits.length !== this.maxHitCount) {
      this.deviceState.resetTarget();
    }
  };

  onResetPress = () => {
    this.stop(false);

    // Reset values
    this.hits = [];
    this.exerciseStartTime = undefined;

    this.start();
  };

  private step = () => {
    if (this.isStepping) {
      return;
    }
    this.isStepping = true;

    if (this.exerciseStartTime === undefined) {
      this.exerciseStartTime = new Date();
    }

    if (this.hits.length >= this.maxHitCount) {
      this.endExercise();
      return;
    }

    this.timer = setTimeout(() => {
      this.deviceState.resetTarget();
      this.isStepping = false;
      this.isHit = false;
    }, this.targetResetTimeout);
  };

  private onHitStateUpdated = ({ targetStatus, hitForce, hitDuration }: DeviceData) => {
    if (targetStatus === TargetStatus.Hit && !this.isHit) {
      this.isHit = true;
      this.hits.push({
        force: +hitForce,
        time: +hitDuration
      });
      this.step();
    }
  };

  private endExercise = () => {
    this.disable?.();

    if (this.exerciseStartTime === undefined) {
      return;
    }

    const endTime = new Date();
    const totalTime = endTime.getTime() - this.exerciseStartTime?.getTime();

    const totalHitForce = this.hits.map(it => it.force)
      .reduce(((previousValue, currentValue) => previousValue + currentValue));
    const averageHitForce = Math.round(totalHitForce / this.hits.length);

    const totalHitTime = this.hits.map(it => it.time)
      .reduce(((previousValue, currentValue) => previousValue + currentValue));
    const averageHitTime = Math.round(totalHitTime / this.hits.length);

    Alert.alert("Summary",
      `Hits: ${this.hits.length}\n` +
      `Total duration: ${format(new Date(totalTime), "%M:%SS.%f")}\n` +
      `\n` +
      `Average force: ${averageHitForce} / 4095\n` +
      `Average reaction time: ${format(new Date(averageHitTime), "%M:%SS.%f")}`,
      [
        {
          text: "OK",
          onPress: () => this.deviceState.resetTarget()
        }
      ]
    );
  };

  private stopTimer = () => {
    if (this.timer === null) {
      return;
    }
    clearTimeout(this.timer);
    this.isStepping = false;
  };
}
