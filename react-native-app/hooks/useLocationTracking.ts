import { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import * as Location from 'expo-location';
import {request, check, PERMISSIONS, RESULTS, requestLocationAccuracy} from 'react-native-permissions';
//import * as Permissions from 'expo-permissions'; DEPRECATED
import axios from 'axios';
const baseUrl = 'https://13js1r8gt8.execute-api.us-west-2.amazonaws.com/dev';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import ServerFacade from '../backend/ServerFacade';

export default function useLocationTracking() {
    var locationBgManager = NativeModules.MyLocationDataManager;

    const [currLocation, setLocation] = useState<Location.LocationObject>();
    const distCheckThreshold = .0005

    useEffect(() => {
      console.log("Component Did Mount...");
      const interval = setInterval(() => _getLocationAsync(), 5000);
      
      const eventEmitter = new NativeEventEmitter(NativeModules.MyLocationDataManager);

      const sub = eventEmitter.addListener('significantLocationChange', onSignificantBackgroundLocationChange);

      return () => {
        console.log("Component Will Unmount...");
        clearInterval(interval);
        sub.remove();
      }
    }, [])

    const onSignificantBackgroundLocationChange = (lastLocation : any) => {
        console.log("CLOSEDAPPLOCATIONRETRIEVAL");
        console.log(lastLocation);
    }

    const _sendLocalNotification = () => {
        if (Platform.OS == "ios") {
            let localNotification = PushNotificationIOS.addNotificationRequest({
                id: "1",
                body: "You are in a forbidden restaurant!",
                title: "SNITCH",
                category: "UHOH",
            });
        }
        //TODO: add in android local notification logic
    }

    const _evaluateCheckLocationCall = (response) => {
        //if inRestaurant
            //is the app open? transition to snitch screen
            //is the app in background? send local notification
    }

    const _measureLatestLocationUpdate = async(locationToMeasure : Location.LocationObject) => {
        if (currLocation == null) { 
            console.log("NULL CurrLocation...API CALL")
            ServerFacade.checkLocation(locationToMeasure["coords"]["latitude"], locationToMeasure["coords"]["longitude"]).then((result) => {
                console.log("Returned with result: " + result);
            }).catch((error) => {
                console.log("Returned with error: " + error);
            })
            setLocation(locationToMeasure);
        } else { //measure a distance 
            //.001 is like a block
            if (Math.abs(currLocation["coords"]["latitude"] - locationToMeasure["coords"]["latitude"]) > distCheckThreshold ||
            Math.abs(currLocation["coords"]["longitude"] - locationToMeasure["coords"]["longitude"]) > distCheckThreshold) {
                //api call to check location
                console.log("Significant Change...API CALL")
                setLocation(locationToMeasure);
            } else {
                console.log("No significant change...no api call");
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
                console.log('The permission is granted');
                let location = Location.getCurrentPositionAsync({})
                    .then(function(location) { _measureLatestLocationUpdate(location) })
                    .catch(function(error) { console.log("Error getting location"); console.log(error)});
                
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
}