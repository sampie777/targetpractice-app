import { DeviceState } from "../DeviceState";

export abstract class Exercise {
  protected readonly deviceState: DeviceState;
  protected readonly disable?: () => void;

  constructor(deviceState: DeviceState, disable?: () => void) {
    this.deviceState = deviceState;
    this.disable = disable;
  };

  static readonly title: string = "Unknown";
  static readonly description: string = "";

  abstract start: () => void;
  abstract stop: () => void;
  abstract onResetPress?: () => void;
}
