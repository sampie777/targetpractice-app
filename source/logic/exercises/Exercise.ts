
export interface Exercise {
  // With constructor:
  //   constructor(deviceState: DeviceState) {}

  start: () => void;
  stop: () => void;
  onResetPress?: () => void;
}
