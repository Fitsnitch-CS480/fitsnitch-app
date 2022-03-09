import { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, Platform, AppState } from "react-native";
import * as Location from 'expo-location';
import {request, check, PERMISSIONS, RESULTS, requestLocationAccuracy} from 'react-native-permissions';
//import * as Permissions from 'expo-permissions'; DEPRECATED
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import ServerFacade from '../backend/ServerFacade';
import useInterval from './useInterval';
import { useNavigation, useNavigationState } from '@react-navigation/native';

export default function useLocationTracking() {
    var locationBgManager = NativeModules.MyLocationDataManager;

    const [currLocation, setLocation] = useState<Location.LocationObject>();
    const [isMoving, setIsMoving] = useState(false);

    const [isGettingSnitchedOnFlag, setIsGettingSnitchedOnFlag] = useState(false); //is the user in the GetSnitchedOn view?
    const [wouldLeaveTimer, setWouldLeaveTimer] = useState(0); //when the user says they will leave, they have 30 seconds before they are tracked again
    const [commitedToLeaveFlag, setCommittedToLeaveFlag] = useState(false);

    const distCheckThreshold = .0005
    const locationCheckFrequencyMS = 5000;
    const userLeavingGraceTime = 30;

    const navigator = useNavigation();
    var routes = useNavigationState(state => state?.routes);
    var index = useNavigationState(state => state?.index);

    useEffect(() => {
      console.log("Component Did Mount...");
      //const interval = setInterval(() => _getLocationAsync(), 5000);

      _startBgTracking();
      
      const eventEmitter = new NativeEventEmitter(NativeModules.MyLocationDataManager);

      const sub = eventEmitter.addListener('significantLocationChange', onSignificantBackgroundLocationChange);

      return () => {
        console.log("Component Will Unmount...");
        //clearInterval(interval);
        sub.remove();
      }
    }, [])
    
    const onSignificantBackgroundLocationChange = (lastLocation : any) => {
        console.log("CLOSEDAPPLOCATIONRETRIEVAL");
        console.log(lastLocation);
    }

    const _startBgTracking = async () => {
        const result = await locationBgManager.requestPermissions('');
  
        console.log("Request Permissions: " + result);
    }

    const _sendLocalNotification = () => {
        if (Platform.OS == "ios") {
            let localNotification = PushNotificationIOS.addNotificationRequest({
                id: "1",
                body: "You are in a forbidden restaurant! You have " + userLeavingGraceTime + " seconds to leave!",
                title: "Uh Oh!",
                category: "UHOH",
            });
        }
        //TODO: add in android local notification logic
    }

    const _evaluateCheckLocationCall = () => {
        console.log("IN RESTARAUNT");
        console.log(AppState.currentState);
        if (AppState.currentState == "active") {
            navigator.navigate("GetSnitchedOn", {});
        } else {
            _sendLocalNotification();
            navigator.navigate("GetSnitchedOn", {});
        }
    }

    const _measureLatestLocationUpdate = async(locationToMeasure : Location.LocationObject) => {
        if (currLocation == null) { 
            console.log("NULL CurrLocation...API CALL")
            ServerFacade.checkLocation(locationToMeasure["coords"]["latitude"], locationToMeasure["coords"]["longitude"]).then((result) => {
                console.log("Returned with result: " + result);
                if (result.status == 200) {
                    _evaluateCheckLocationCall();
                }
            }).catch((error) => {
                console.log("Returned with error: " + error);
            })
            setLocation(locationToMeasure);
        } else { //measure a distance 
            //.001 is like a block
            if (isMoving) {
                console.log("Is moving");
                if (Math.abs(currLocation["coords"]["latitude"] - locationToMeasure["coords"]["latitude"]) < .00001 ||
                Math.abs(currLocation["coords"]["longitude"] - locationToMeasure["coords"]["longitude"]) < .00001) { //stopped moving within a given radius
                    setIsMoving(false);
                    console.log("Movement Stopped...API CALL");
                    ServerFacade.checkLocation(locationToMeasure["coords"]["latitude"], locationToMeasure["coords"]["longitude"]).then((result) => {
                        console.log("Returned with result: " + result);
                        if (result.status == 200) {
                            _evaluateCheckLocationCall();
                        } else if (result.status == 502) { //timeout

                        }
                    }).catch((error) => {
                        console.log("Returned with error: " + error);
                    })
                    setLocation(locationToMeasure);
                } else { //else is still moving
                    setLocation(locationToMeasure);
                }
            } else {
                console.log("Not moving...");
                if (Math.abs(currLocation["coords"]["latitude"] - locationToMeasure["coords"]["latitude"]) > .00001 ||
                Math.abs(currLocation["coords"]["longitude"] - locationToMeasure["coords"]["longitude"]) > .00001) { //started moving
                    setIsMoving(true);
                    console.log("Significant Change, is now moving");
                    setLocation(locationToMeasure);
                } //else still not moving
            }
        }
    }
  
    const _getLocationAsync = async () => {

        check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then((result) => {
            switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('This feature is not available (on this device / in this context)');
                break;
            case RESULTS.DENIED:
                console.log('The permission has not been requested / is denied but requestable');
                request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                    console.log("Permission Requested:");
                    console.log(result);
                  });
                break;
            case RESULTS.LIMITED:
                console.log('The permission is limited: some actions are possible');
                break;
            case RESULTS.GRANTED:
                console.log("Running location tracking hook");
                if (routes) {  //used to track visits to the GetSnitchedOn screen
                    console.log("CURRSCREENNAME IS: " + routes[index].name);
                    console.log("wouldLeaveTimer: " + wouldLeaveTimer);
                    if (routes[index].name == "GetSnitchedOn") { //don't ping location when they've just been snitched on
                        if (!isGettingSnitchedOnFlag) {
                            setIsGettingSnitchedOnFlag(true);
                        }
                    } else { //dont ping for location when user is getting snitched on
                        if (isGettingSnitchedOnFlag) {  //user just exited GetSnitchedOn screen, this may have been due to a commitment to leave or because they have been snitched on, wait 30 sec before pinging again
                            setWouldLeaveTimer(userLeavingGraceTime);    
                            setLocation(undefined);
                            setIsGettingSnitchedOnFlag(false);
                        }

                        if (wouldLeaveTimer <= 0) {
                            let location = Location.getCurrentPositionAsync({})
                                .then(function(location) { _measureLatestLocationUpdate(location) })
                                .catch(function(error) { console.log("Error getting location"); console.log(error)});
                        } else {
                            setWouldLeaveTimer(wouldLeaveTimer => wouldLeaveTimer - (locationCheckFrequencyMS / 1000));
                        }
                    }
                } else {  //will receive urgent location updates and initialize routes
                    let location = Location.getCurrentPositionAsync({})
                    .then(function(location) { _measureLatestLocationUpdate(location) })
                    .catch(function(error) { console.log("Error getting location"); console.log(error)});
                }

                break;
            case RESULTS.BLOCKED:
                console.log('The permission is denied and not requestable anymore');
                break;
            }
        })
        .catch((error) => {
            console.log("Error while checking iOS permissions");
            console.log(error);
        });
    }

    useInterval(_getLocationAsync, locationCheckFrequencyMS);
}