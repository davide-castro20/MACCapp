# MACC-app

Project for Mobile Applications and Cloud Computing course in Sapienza Università di Roma

## Instructions

1. Install Android Studio, making sure the following components are installed:
    - Android SDK
    - Android SDK Platform
    - Android Virtual Device
2. Set ANDROID_HOME to the path of the Android SDK
3. Install node modules

    ```bash
    npm install
    ```

4. Start the application
    ```bash
    npx react-native run-android
    ```

## Build APK

1. Run react-native bundle
    ```bash
    npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
    ```
2. Assemble android APK. In /android/ run:
    ```bash
    ./gradlew assembleDebug
    ```
