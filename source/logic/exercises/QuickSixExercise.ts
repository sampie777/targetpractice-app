import { Exercise } from "./Exercise";
import { DeviceData, DeviceState, TargetStatus } from "../DeviceState";
import { Alert } from "react-native";
import { format } from "../utils";

interface Hit {
  force: number;
  time: number;
}

export class QuickSixExercise implements Exercise {
  private deviceState: DeviceState;
  private disable?: () => void;

  private isStepping = false;
  private isHit = false;
  private timer: any = null;
  private targetResetTimeout = 400;
  private exerciseStartMinimumTimeout = 4000;
  private exerciseStartMaximumTimeout = 8000;

  private exerciseStartTime: Date | undefined = undefined;
  private maxHitCount = 6;
  private hits: Hit[] = [];

  constructor(deviceState: DeviceState, disable?: () => void) {
    this.deviceState = deviceState;
    this.disable = disable;
  };

  start = () => {
    this.deviceState.addEventListener(this.onHitStateUpdated);
    this.deviceState.disableTarget();
    this.timer = setTimeout(
      () => this.step(),
      Math.random() * (this.exerciseStartMaximumTimeout - this.exerciseStartMinimumTimeout) + this.exerciseStartMinimumTimeout
    );
  };

  stop = () => {
    this.deviceState.removeEventListener(this.onHitStateUpdated);
    this.stopTimer();
    this.deviceState.resetTarget();
  };

  onResetPress = () => {
    this.stopTimer();
    this.deviceState.disableTarget();
    this.step();
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
      `Average reaction time: ${format(new Date(averageHitTime), "%M:%SS.%f")}`
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
