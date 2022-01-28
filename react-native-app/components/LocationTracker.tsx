import React, {useContext, useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import {userContext} from '../navigation/mainNavigator';
import {check, checkNotifications, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Popup from '../components/Popup';
import ServerFacade from '../backend/ServerFacade';
import User from '../shared/models/User';
import useLocationTracking from '../hooks/useLocationTracking';

export default function LocationTracker(){

    // const [currTest, setTest] = useState(1);

    // useEffect(() => {
    //     const interval = setInterval(() => _update(), 2000);

    //     return () => {
    //       clearInterval(interval);
    //     }
    //   }, [])

    // const _update = () => {
    //     setTest(prevTest => prevTest + 1);
    //     console.log("State is: " + currTest);
    // }

    useLocationTracking();

    return (null);
}