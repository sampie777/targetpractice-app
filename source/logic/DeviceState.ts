import Config from "../config";
import Bluetooth, { Peripheral } from "./bluetooth";
import { bytesToString, stringToBytes } from "./utils";


export enum TargetStatus {
  Disabled,
  Ready,
  Hit,
  Unknown,
}

export interface DeviceData {
  targetStatus: TargetStatus;
  hitForce: string;
  hitDuration: string;
}

export class DeviceState {
  private callbacks: Set<(state: DeviceData) => void> = new Set();
  private pollInterval: any = null;
  private device: Peripheral;
  private disconnect: () => void;
  private data: DeviceData = {
    targetStatus: TargetStatus.Unknown,
    hitForce: "",
    hitDuration: ""
  };

  constructor(device: Peripheral,
              disconnect: () => void) {
    this.device = device;
    this.disconnect = disconnect;
  }

  addEventListener(callback: (state: DeviceData) => void) {
    this.callbacks.add(callback);
  }

  removeEventListener(callback: (state: DeviceData) => void) {
    this.callbacks.delete(callback);
  }

  startPolling() {
    this.stopPolling();
    this.pollInterval = setInterval(() => this.requestHitData(), Config.pollInterval);
  }

  stopPolling() {
    if (this.pollInterval == null) {
      return;
    }
    clearInterval(this.pollInterval);
  }

  private requestHitData = () => {
    Bluetooth.manager.read(this.device.id, Config.service, Config.characteristic)
      .then((data: Uint8Array) => {
        const text = bytesToString(data);
        this.processReceivedData(text);
        this.executeEventListeners();
      })
      .catch((error: any) => {
        this.stopPolling();

        if (error == "Device is not connected"
          || error == "Device disconnected"
          || error == "Peripheral not found") {
          return;
        }

        console.error("Failed to read from device", error);
        this.disconnect();
      });
  };

  private processReceivedData = (data: string) => {
    if (data.startsWith("hit")) {
      this.data.targetStatus = TargetStatus.Hit;
      if (data.includes(";")) {
        const measurements = data.split(";");
        this.data.hitForce = measurements[1];

        if (measurements.length > 2) {
          this.data.hitDuration = measurements[2];
        }
      }
      return;
    }

    this.data.hitForce = "";
    this.data.hitDuration = "";

    if (data === "on") {
      this.data.targetStatus = TargetStatus.Ready;
    } else if (data === "off") {
      this.data.targetStatus = TargetStatus.Disabled;
    } else {
      this.data.targetStatus = TargetStatus.Unknown;
    }
  };

  private executeEventListeners() {
    this.callbacks.forEach(it => {
      try {
        it(this.data);
      } catch (e: any) {
        console.error("Callback gave error", e);
      }
    });
  }

  resetTarget = (): Promise<any> => this.send("on");

  disableTarget = (): Promise<any> => this.send("off");

  send = (text: string): Promise<any> => {
    const data = stringToBytes(text);
    return Bluetooth.manager.write(this.device.id, Config.service, Config.characteristic, data)
      .catch((error: any) => {
        console.error("Failed to send to device", error);
      });
  };
}
