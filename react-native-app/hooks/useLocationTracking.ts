import React from "react";
import { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, Platform, AppState } from "react-native";
import * as Location from 'expo-location';
import {request, check, PERMISSIONS, RESULTS, requestLocationAccuracy} from 'react-native-permissions';
//import * as Permissions from 'expo-permissions'; DEPRECATED
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import ServerFacade from '../backend/ServerFacade';
import useInterval from './useInterval';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { LatLonPair } from '../shared/models/CoordinateModels';

export default function useLocationTracking(onLog?:any) {
    var locationBgManager = NativeModules.MyLocationDataManager;

    const [currLocation, setLocation] = useState<Location.LocationObject>();
    const [wasMoving, setWasMoving] = useState(false);

    const [isGettingSnitchedOnFlag, setIsGettingSnitchedOnFlag] = useState(false); //is the user in the GetSnitchedOn view?
    const [wouldLeaveTime, setWouldLeaveTime] = useState<number|null>(null); //when the user says they will leave, they have 30 seconds before they are tracked again
    const [commitedToLeaveFlag, setCommittedToLeaveFlag] = useState(false);
    
    const [doCheck, setDoCheck] = useState(true);

    const distCheckThreshold = .0001
    const locationCheckFrequencyMS = 5000;
    const userLeavingGraceTime = 30000;

    const navigator = useNavigation();
    var routes = useNavigationState(state => state?.routes);
    var index = useNavigationState(state => state?.index);

    function log(...logs:any[]) {
        if (onLog) onLog(...logs);
    }

    useEffect(() => {
      //const interval = setInterval(() => _getLocationAsync(), 5000);
      _startBgTracking();
      
    //   TODO: suppport Android Background
      const eventEmitter = new NativeEventEmitter(NativeModules.MyLocationDataManager);

      const sub = eventEmitter?
        eventEmitter.addListener('significantLocationChange', onSignificantBackgroundLocationChange)
        : null;

      return () => {
        log("Unmounting hook...");
        //clearInterval(interval);
        if (sub) sub.remove();
        setDoCheck(false);

      }
    }, [])
    
    const onSignificantBackgroundLocationChange = (lastLocation : any) => {
        log("CLOSEDAPPLOCATIONRETRIEVAL");
        log(lastLocation);
    }

    const _startBgTracking = async () => {
        if (!locationBgManager) return;
        const result = await locationBgManager.requestPermissions('');
  
        log("Request Permissions: " + result);
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

    const _checkLocationForRestaurant = async (coords:LatLonPair) => {
        console.log("looking for restaurant...")
        try {
            let result = await ServerFacade.checkLocation(coords.lat, coords.lon)
            log("Restaurant check:", result.response.data);
            if (result.status == 200) {
                log("IN RESTARAUNT");
                log(AppState.currentState);
                if (AppState.currentState !== "active") {
                    _sendLocalNotification();
                }
                navigator.navigate("GetSnitchedOn", {restaurant: result.response.data, coords});
            }
            else if (result.status == 404) {
                console.log("No restaurant here.")
            }
            return true
        }
        catch (e) {
            log("Could not get restaurant data.", e)
            return false
        }
        
    }

    const _measureLatestLocationUpdate = async(locationToMeasure : Location.LocationObject) => {
        let newCoords = new LatLonPair(locationToMeasure.coords.latitude,locationToMeasure.coords.longitude)
        log("Location:", newCoords)
        if (currLocation == null) { 
            log("No previous location - checking for restaurant...")
            while (!await _checkLocationForRestaurant(newCoords)) {} 
            setLocation(locationToMeasure);
        }
        else { //measure a distance 
            let deltaLat = Math.abs(currLocation.coords.latitude - newCoords.lat);
            let deltaLon = Math.abs(currLocation.coords.longitude - newCoords.lon);
            let movedSignificantly = deltaLat > distCheckThreshold || deltaLon > distCheckThreshold;
            log({deltaLat, deltaLon, movedSignificantly})

            if (movedSignificantly) {
                if (!wasMoving) {
                    setWasMoving(true);
                    log("Significant Change, is now moving");
                    setLocation(locationToMeasure);
                }
                else {
                    log("Still moving...")
                }
                setLocation(locationToMeasure);
            }

            else if (!movedSignificantly) {
                if (wasMoving) {
                    log("Movement Stopped - checking location...")
                    setWasMoving(false);
                    while (!await _checkLocationForRestaurant(newCoords)) {} 
                }
                else {
                    log("Still not moving...")
                }
            }
        }

    }
  
    const _getLocationAsync = async () => {        
        if (!doCheck) {
            log("(Prevented new check cycle...)")
            return;
        }

        setDoCheck(false);
        console.log("\n\n");

        let permission;

        if (Platform.OS == "android") {
            permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .catch((error) => {
                log("Error while checking Android permissions");
                log(error);
            });
        }

        else if (Platform.OS == "ios") {
            permission = await check(PERMISSIONS.IOS.LOCATION_ALWAYS)
            .catch((error) => {
                log("Error while checking iOS permissions");
                log(error);
            });
        }

        switch (permission) {
            case RESULTS.UNAVAILABLE:
                log('This feature is not available (on this device / in this context)');
                break;
            case RESULTS.DENIED:
                log('The permission has not been requested / is denied but requestable');
                request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                    log("Permission Requested:");
                    log(result);
                });
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
                    log("Permission Requested:");
                    log(result);
                });
                
                break;
            case RESULTS.LIMITED:
                log('The permission is limited: some actions are possible');
                break;
            case RESULTS.GRANTED:
                if (routes) {  //used to track visits to the GetSnitchedOn screen
                    log("CURRSCREENNAME IS: " + routes[index].name);
                    if (routes[index].name == "GetSnitchedOn") { //don't ping location when they've just been snitched on
                        log("user is getting snitched on")
                        if (!isGettingSnitchedOnFlag) {
                            setIsGettingSnitchedOnFlag(true);
                        }
                    }
                    else { //dont ping for location when user is getting snitched on

                        // TODO: Use global context or state to manage snitching phases
                        if (isGettingSnitchedOnFlag) {  //user just exited GetSnitchedOn screen, this may have been due to a commitment to leave or because they have been snitched on, wait 30 sec before pinging again
                            log("user left GetSnitchedOn screen. Starting grace period")
                            setWouldLeaveTime(Date.now());    
                            setLocation(undefined);
                            setIsGettingSnitchedOnFlag(false);
                        }

                        else {
                            let timePassed = wouldLeaveTime? Date.now() - wouldLeaveTime : Infinity;
                            let isInGracePeriod = timePassed < userLeavingGraceTime;
                            if (isInGracePeriod) {
                                log("Grace period progress: " + timePassed);
                            }
    
                            else {
                                if (wouldLeaveTime) {
                                    log("Grace time is up!")
                                    setWouldLeaveTime(null);
                                }
                                try {
                                    await checkForLocationChange()
                                }
                                catch(error) {
                                    log("Error getting location:", error);
                                };
                            
                            }
                        }
                      
                    }
                }
                else {  //will receive urgent location updates and initialize routes
                    await checkForLocationChange()
                }

                break;
            case RESULTS.BLOCKED:
                log('The permission is denied and not requestable anymore');
                break;
            }

            setDoCheck(true);
            log("Ready for next check.")
    }

    async function checkForLocationChange() {
        try {
            log("getting location")
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge:locationCheckFrequencyMS/2, timeout:5000} as any)
            await _measureLatestLocationUpdate(location)    
        }
        catch(error) {
            log("Error getting location:", error);
        };
    }

    useInterval(_getLocationAsync, locationCheckFrequencyMS);

}
