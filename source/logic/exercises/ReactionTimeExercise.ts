import { Exercise } from "./Exercise";

export class ReactionTimeExercise extends Exercise {
  private readonly minimumTargetResetTimeout = 3000;
  private readonly maximumTargetResetTimeout = 8000;
  private isStepping = false;
  private timer: any = null;

  static readonly title = "Reaction time";
  static readonly description =
    "This is a single shot exercise. \n" +
    "\n" +
    "1. When activated, the target will go dark for an random amount of time. \n" +
    "2. When the target turns on, you have to shoot it as quick as you can. The results will be shown on screen. \n" +
    "3. Tap the screen to start a new round.\n" +
    "\n" +
    "If you weren't ready, just tap the screen to reset.";

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
