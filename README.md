# FitSnitch-App

See the project wiki for more docs and resources: https://github.com/Fitsnitch-CS480/fitsnitch-app/wiki

## Getting Started

- Clone the repository into a new folder
- Install dependencies: `npm ci`
  - This command will only install exactly what is in the `package-lock.json` and will not attempt to update any packages.

### Environment Variables

The dev server needs credentials to access AWS. Create a file at `backend/.env` with the following variables:

``` bash
AWS_ACCESS_KEY_ID="<get-a-valid-key>"
AWS_SECRET_ACCESS_KEY="<secret-for-your-key>"
```

Talk to another dev about getting credentials.


### aws-exports file

You'll also need to create `react-native-app/aws-exports.js` because for some reason Amplify doesn't want that file in the git history.

You can get the contents for that file from BitWarden.

We want to stop using Amplify eventually so we'll just deal with it for now.

## Local Environment

Make sure your environment is prepared to run either Android or iOS emulators.

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

You will need to add a mapping to the port running the server on your machine. To do so, run the following commands:

- Android (Windows cmd): `adb reverse tcp:4000 tcp:4000`
- iOS: ???


You can test the mapping by visiting `localhost:4000` in a browser on your emulator. It should simply return 'FitSnitch Server'.

Now you're ready to run the app in an emulator! If you have everything setup right in your environment, that should be as simple as running the appropriate npm script:

- Android: `cd react-native-app && npm run android`
- iOS: `cd react-native-app && npm run ios`

Either of those will spin up the Metro server (provides hot reloading for the React Native app itself) and the appropriate emulator.
