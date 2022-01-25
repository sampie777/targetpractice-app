// @ts-ignore
import BleManager from "react-native-ble-manager/BleManager";
import { NativeEventEmitter, NativeModules } from "react-native";

export interface Characteristic {
  characteristic: string
  descriptors?: Array<any>
  properties: object
  service: string
}

export interface AdvertisingPayload {
  isConnectable: boolean;
  serviceUUIDs: string[];
  manufacturerData: object;
  serviceData: object;
  txPowerLevel: number;
}

export interface Peripheral {
  id: string;
  name: string;
  rssi: number;
  advertising: AdvertisingPayload;
}

class BluetoothManager {
  isInitialized = false;

  private _BleManagerModule = NativeModules.BleManager;
  emitter = new NativeEventEmitter(this._BleManagerModule);
  manager = BleManager;

  constructor() {
    if (this.isInitialized) {
      console.warn("Bluetooth is already initialized");
      return;
    }

    BleManager.start({ showAlert: false })
      .then(() => {
        this.isInitialized = true;
        this.manager.checkState();
        console.log("Bluetooth initialized");
      });
  };
}

const Bluetooth = new BluetoothManager();
export default Bluetooth;
