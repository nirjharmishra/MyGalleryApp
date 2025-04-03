# Building an APK for MyGallery App

This document provides instructions for building an APK file for the MyGallery app.

## Prerequisites

1. Node.js and npm installed
2. Expo CLI installed globally (`npm install -g expo-cli`)
3. An Expo account (create one at https://expo.dev/signup)

## Building the APK

### Option 1: Using Expo Build Service (Recommended)

1. Log in to your Expo account:
   ```
   expo login
   ```

2. Start the build process:
   ```
   npm run build:android
   ```

3. Follow the prompts in the terminal. The build will be queued on Expo's servers.

4. Once the build is complete, you'll receive a URL to download the APK file.

### Option 2: Local Build (Requires Android Studio)

1. Install Android Studio and set up the Android SDK.

2. Generate native Android project files:
   ```
   npm run prebuild
   ```

3. Open the generated Android project in Android Studio:
   ```
   cd android
   ./gradlew assembleRelease
   ```

4. The APK will be generated at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## Testing the APK

1. Transfer the APK to your Android device.
2. Install the APK by opening it on your device.
3. Grant the necessary permissions when prompted.
4. The app should display "MyGallery made by nirjhar" on the welcome screen.
5. Tap "View Gallery" to see photos from your device.

## Troubleshooting

- If you encounter permission issues, make sure the app has permission to access photos.
- If the app crashes, check the logs for more information.
- For build errors, ensure all dependencies are properly installed.