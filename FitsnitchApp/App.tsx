import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import LoginView from './views/LoginView';
import SnitchesView from './views/SnitchesView';
import UserProfileView from './views/UserProfileView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PeopleView from './views/PeopleView';
import SettingsView from './views/SettingsView';
import MainNavigator from './navigation/mainNavigator';

export default function App(){
  return(
    <MainNavigator/>
  )
}