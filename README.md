# BB gun target practice

To be used with ESP32 hardware with Bluetooth LE connection. See suggested firmware: https://github.com/sampie777/targetpractice-ESP32server.

> Apologies for the dirty code in some places. This was created as prototype, not to be distributed.

## How it works

When your target is up (see ESP32server link above), you can connect with the target via Bluetooth LE. Open the app and connect with the target. 

The app will show the current status of the target. When the target is hit, some measurements about the hit will be shown. By clicking on the target, the target will reset.

Use the configuration menu to set up the target: hit threshold, LED brightness, and app refresh interval (soon this will be replaced with a notification system).

Exercises can be started. These exercises will control the target for you so you can focus on practicing. Long press on an exercise to see its description.  

If the app crashes or the target/app doesn't respond, just close the app and try again. In serious connection problem cases: turn off the target and your bluetooth. Exit the app also. Turn bluetooth on and enter the app. Then, turn on the target.

## Bluetooth LE

Guides: 
- For React Native: https://github.com/innoveit/react-native-ble-manager
- And for the ESP32: https://www.electronicshub.org/esp32-ble-tutorial/
