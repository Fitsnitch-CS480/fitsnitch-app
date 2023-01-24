# FitSnitch-App

See the project wiki for more docs and resources: https://github.com/Fitsnitch-CS480/fitsnitch-app/wiki

## Getting Started

- Clone the repository into a new folder
- Install dependencies: `npm ci`
  - This command will only install exactly what is in the `package-lock.json` and will not attempt to update any packages.

After that, make sure your environment is prepared to run either Android or iOS.

### Android Prep

...

### iOS Prep

...

## Local Development

To run the app locally, you need to first have the local server running:

``` bash
cd backend && npm run dev
```

The above commands will start the server in dev mode which compile the Typescript and watch for changes.

Now you're ready to run the app in an emulator! If you have everything setup right in your environment, that should be as simple as running the appropriate npm script:

- Android: `cd react-native-app && npm run android`
- iOS: `cd react-native-app && npm run ios`

Either of those will spin up the Metro server (provides hot reloading for the React Native app itself) and the appropriate emulator.