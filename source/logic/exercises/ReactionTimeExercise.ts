import { Exercise } from "./Exercise";
import { DeviceState } from "../DeviceState";

export class ReactionTimeExercise implements Exercise {
  private deviceState: DeviceState;
  private isStepping = false;
  private timer: any = null;
  private minimumTargetResetTimeout = 3000;
  private maximumTargetResetTimeout = this.minimumTargetResetTimeout + 8000;

  constructor(deviceState: DeviceState) {
    this.deviceState = deviceState;
  };

  start = () => {
    this.deviceState.disableTarget();
    this.step();
  };

  stop = () => {
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

    this.timer = setTimeout(() => {
      this.deviceState.resetTarget();
      this.isStepping = false;
    }, Math.random() * (this.maximumTargetResetTimeout - this.minimumTargetResetTimeout) + this.minimumTargetResetTimeout);
  };

  private stopTimer = () => {
    if (this.timer === null) {
      return;
    }
    clearTimeout(this.timer);
    this.isStepping = false;
  };
}
