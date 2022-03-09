import React from "react";
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation } from '@react-navigation/native';
import SnitchesView from '../views/SnitchesView';
import OtherUserProfile from '../views/OtherUserProfile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PeopleView from '../views/PeopleView/PeopleView';
import SettingsView from '../views/SettingsView';
import TabViewNavigator from "./TabViewNavigator";
import UserSearch from "../views/UserSearch";
import Profile from "../components/Profile";
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocationTracker from '../components/LocationTracker';
import { createStackNavigator } from "@react-navigation/stack";
import GetSnitchedView from "../views/GetSnitchedView";
import TabNavigator from "./tabNavigator";


const AppNavigator : React.FC = () => {

    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    return (
      <><Stack.Navigator initialRouteName="Tabs">
        <Tab.Screen name="Tabs" component={TabViewNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Search" component={UserSearch} />
        <Tab.Screen name="OtherUserProfile"
          component={OtherUserProfile}
          options={({ route }) => {
            let { profileOwner } = route.params as any;
            return {
              headerTitle: `${profileOwner?.firstname}'s Profile` || "Profile"
            };
          } } />
        <Stack.Screen name="GetSnitchedOn" component={GetSnitchedView} />
      </Stack.Navigator><LocationTracker/></>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    greeting: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 16
    }
  });

export default AppNavigator;