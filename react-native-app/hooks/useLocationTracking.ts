import React, { useContext } from "react";
import { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, Platform, AppState, PermissionsAndroid } from "react-native";
import * as Location from 'expo-location';
import {request, check, PERMISSIONS, RESULTS, requestLocationAccuracy} from 'react-native-permissions';
//import * as Permissions from 'expo-permissions'; DEPRECATED
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import ServerFacade from '../backend/ServerFacade';
import useInterval from './useInterval';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { LatLonPair } from '../shared/models/CoordinateModels';
import { globalContext } from "../navigation/appNavigator";
import {observer} from 'mobx-react-lite'
import { retry } from "@aws-amplify/core";
import { getMetaData, NativeInput } from "../models/NativeInput";

/**
 * ****NOTE:
 * 
 * Most of the logic here has been replaced in the Native Android
 * LocationModule and will also need to be replaced for iOS.
 * 
 * At this point this hook only handles starting the location tracking services
 * in native libraries and setting up event listeners. This logic could
 * eventually be moved elsewhere.
 * 
 * Running this logic on the native device allows us to still trigger
 * and publish snitches when the app is closed.
 */

// const distCheckThreshold = .0001
// const locationCheckFrequencyMS = 5000;

export default observer(function UseLocationTracking({onLog}: any) {
// export function useLocationTracking(onLog?:any) {
    var locationBgManager = NativeModules.MyLocationDataManager;
    var locationBgManagerAndroid = NativeModules.LocationManager;
    const [currLocation, setLocation] = useState<Location.LocationObject>();
    const [wasMoving, setWasMoving] = useState(false);

    const {/*locationStore,*/ logStore} = useContext(globalContext);

    const [doCheck, setDoCheck] = useState(true);

    const navigator = useNavigation<any>();
    var routes = useNavigationState(state => state?.routes);
    var index = useNavigationState(state => state?.index);
    let testcounter = 1;
    function log(...logs:any[]) {
        logStore.log(...logs);
    }

    useEffect(() => {
        //const interval = setInterval(() => _getLocationAsync(), 5000);
        _startBgTracking();
      
        
        const androidEventEmitter = new NativeEventEmitter(NativeModules.LocationManager);
        const eventEmitter = new NativeEventEmitter(NativeModules.MyLocationDataManager);
        let sub;

        if(Platform.OS == "ios") {
            // sub = eventEmitter?
            // eventEmitter.addListener('significantLocationChange', onSignificantBackgroundLocationChange)
            // : null;
        }
        else if (Platform.OS == "android") {
            sub = androidEventEmitter?
            androidEventEmitter.addListener("NEW_PROPS", handleNewProps)
            : null;
        }
        
        //https://developer.apple.com/documentation/corelocation/getting_the_user_s_location/using_the_significant-change_location_service
        

        return () => {
            log("Unmounting hook...");
            //clearInterval(interval);
            if (sub) sub.remove();
            setDoCheck(false);
        }
    }, [])

    
    const handleNewProps = (event: NativeInput): any => {
        console.log("GOT NEW PROPS!!", event)
        if (event.ACTION === "START_SNITCH") {
            // let newSnitch = getMetaData(event);
            navigator.navigate("GetSnitchedOn", {trigger: Date.now()});
        }
    }
    
    const requestLocationPermission = async () => {
        try {
          let granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Fitsnitch Permission',
              message:
                'Fitsnitch needs to access your location in order to work',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
        );

        if (granted !== "granted") {
            return granted;
        }

        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Fitsnitch Permission',
              message:
                'Fitsnitch needs to access your location in order to work',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
        
          return granted;

        } catch (err) {
          console.warn(err);
          return false;
        }
      };

    // const onSignificantBackgroundLocationChange = (lastLocation : any) => {
    //     log("CLOSEDAPPLOCATIONRETRIEVAL");
    //     log(lastLocation);
    //     console.log("Background location testing working: ", testcounter);
    //     console.log(lastLocation);
    //     testcounter++;
    // }

    const _startBgTracking = async () => {
        let result;
        if(Platform.OS == "ios"){
            if (!locationBgManager) return;
            result = await locationBgManager.requestPermissions('');
        }
        else{
            if (!locationBgManagerAndroid) return;
            result = await requestLocationPermission();
            console.log("background tracking: ", result)
            if(result == RESULTS.GRANTED)
            {
                console.log("START BACKGROUND SERVICE!!!!")
                locationBgManagerAndroid.startBackgroundLocation();
            }
        }
  
        log("Request Permissions: " + result);
    }

    // const _sendLocalNotification = () => {
    //     if (Platform.OS == "ios") {
    //         let localNotification = PushNotificationIOS.addNotificationRequest({
    //             id: "1",
    //             body: "You are in a forbidden restaurant! Hurry and leave, before we snitch on you!",
    //             title: "Uh Oh!",
    //             category: "UHOH",
    //         });
    //     }
    //     console.log("This is trying to send a notification in the background:", testcounter);
    //     //TODO: add in android local notification logic
    // }


    // const _getLocationAsync = async () => {        
    //     if (!doCheck) {
    //         log("(Prevented new check cycle...)")
    //         return;
    //     }
    
    //     setDoCheck(false);
    //     let permission;

    //     if (Platform.OS == "android") {
    //         permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    //         .catch((error) => {
    //             log("Error while checking Android permissions");
    //             log(error);
    //         });
    //     }

    //     else if (Platform.OS == "ios") {
    //         permission = await check(PERMISSIONS.IOS.LOCATION_ALWAYS)
    //         .catch((error) => {
    //             log("Error while checking iOS permissions");
    //             log(error);
    //         });
    //     }

    //     switch (permission) {
    //         case RESULTS.UNAVAILABLE:
    //             log('This feature is not available (on this device / in this context)');
    //             break;
    //         case RESULTS.DENIED:
    //             log('The permission has not been requested / is denied but requestable');
    //             request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
    //                 log("Permission Requested:");
    //                 log(result);
    //             });
    //             request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
    //                 log("Permission Requested:");
    //                 log(result);
    //             });
                
    //             break;
    //         case RESULTS.LIMITED:
    //             log('The permission is limited: some actions are possible');
    //             break;
    //         case RESULTS.GRANTED:
    //             if (shouldDoCheck()) {
    //                 //will receive urgent location updates and initialize routes
    //                 await checkForLocationChange()
    //             }
    //             break;
            
    //             case RESULTS.BLOCKED:
    //             log('The permission is denied and not requestable anymore');
    //             break;
    //         }

    //         setDoCheck(true);
    //         log("Ready for next check.")
    // }

    // function shouldDoCheck():boolean {
    //     if (routes && routes[index].name == "GetSnitchedOn") {
    //         log("user is getting snitched on")
    //         setLocation(undefined) // make sure we refresh location next time
    //         return false
    //     }
    //     if (locationStore.gracePeriodStatus) {
    //         log("Grace period progress: " + locationStore.gracePeriodStatus);
    //         setLocation(undefined) // make sure we refresh location next time
    //         return false
    //     }
    //     return true;
    // }

    // async function checkForLocationChange() {
    //     try {
    //         log("getting location")
    //         let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge:locationCheckFrequencyMS/2, timeout:5000} as any)
    //         await _measureLatestLocationUpdate(location)    
    //     }
    //     catch(error) {
    //         log("Error getting location:", error);
    //     };
    // }

    // const _measureLatestLocationUpdate = async(locationToMeasure : Location.LocationObject) => {
    //     let newCoords = new LatLonPair(locationToMeasure.coords.latitude,locationToMeasure.coords.longitude)

    //     if (locationStore.checkSnitchOrCheatStatus(newCoords)) {
    //         log("Still onsite of last snitch/cheat")
    //         return;
    //     }

    //     log("Location:", newCoords)
    //     if (currLocation == null) { 
    //         log("No previous location - checking for restaurant...")
    //         let success = await _checkLocationForRestaurant(newCoords)
    //         if (!success) setLocation(undefined) // make sure we try checking this location again next time
    //         else setLocation(locationToMeasure);
    //     }
    //     else { //measure a distance 
    //         let deltaLat = Math.abs(currLocation.coords.latitude - newCoords.lat);
    //         let deltaLon = Math.abs(currLocation.coords.longitude - newCoords.lon);
    //         let dist = Math.sqrt(deltaLat ** 2 + deltaLon ** 2)
    //         let movedSignificantly = dist > distCheckThreshold;
    //         log({deltaLat, deltaLon, dist, movedSignificantly})

    //         if (movedSignificantly) {
    //             if (!wasMoving) {
    //                 setWasMoving(true);
    //                 log("Significant Change, is now moving");
    //             }
    //             else {
    //                 log("Still moving...")
    //             }
    //             setLocation(locationToMeasure);
    //         }

    //         else if (!movedSignificantly) {
    //             if (wasMoving) {
    //                 log("Movement Stopped - checking location...")
    //                 setWasMoving(false);
    //                 let success = await _checkLocationForRestaurant(newCoords)
    //                 if (!success) setLocation(undefined) // make sure we try checking this location again next time
    //             }
    //             else {
    //                 log("Still not moving...")
    //             }
    //         }
    //     }
    // }
  
    // /**
    //  * Handles checking for restaurants at a location and routing to
    //  * the snitch warning if there is one.
    //  * 
    //  * @param coords 
    //  * @returns indicates whether or not the check was successful.
    //  */
    // const _checkLocationForRestaurant = async (coords:LatLonPair, retryCount=0) => {
    //     console.log("looking for restaurant...")
    //     try {
    //         let result = await ServerFacade.checkLocation(coords.lat, coords.lon)

    //         if (result?.response?.status == 200) {
    //             log("IN RESTARAUNT");
    //             log(AppState.currentState);
    //             if (AppState.currentState !== "active") {
    //                 _sendLocalNotification();
    //             }
    //             navigator.navigate("GetSnitchedOn", {restaurant: result?.response.data, coords});
    //             return true
    //         }
    //         else if (result?.response?.status == 404) {
    //             log("User is not in a restricted restaurant.")
    //             return true
    //         }
    //         else if (result?.response?.status == 502) {
    //             log(result?.response.status+": likely a reqeuset timeout.")
    //             if (retryCount < 3) {
    //                 log("Trying again...")
    //                 return await _checkLocationForRestaurant(coords, retryCount + 1)
    //             }
    //             else return false;
    //         }
    //         else {
    //             log("Unsupported return code.", result?.response)
    //             return false;
    //         }
    //     }
    //     catch (e) {
    //         log("Could not get restaurant data.", e)
    //         return false;
    //     }
    // }

    // useInterval(_getLocationAsync, locationCheckFrequencyMS);

    return null;
})

