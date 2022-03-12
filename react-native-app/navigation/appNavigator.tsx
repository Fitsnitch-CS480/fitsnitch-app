import React, { createContext, useState } from "react";
import OtherUserProfile from '../views/OtherUserProfile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabViewNavigator from "./TabViewNavigator";
import UserSearch from "../views/UserSearch";
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetSnitchedView from "../views/GetSnitchedView";
import User from "../shared/models/User";
import LocationStore from "../stores/LocationStore";
import UseLocationTracking from "../hooks/useLocationTracking";
import LogUI from "../components/LogUI";
import LogStore from "../stores/LogStore";

type props = {
  authUser: User
}

type statePiece<T> = [T, React.Dispatch<React.SetStateAction<T>>]

export var globalContext: React.Context<{
  currentUserState: statePiece<User>,
  locationStore: LocationStore
  logStore: LogStore
}>;

const AppNavigator : React.FC<props> = ({authUser}) => {
    if (!authUser) return null;
    
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    const gCtx = {
      currentUserState: useState<User>(authUser),
      locationStore: new LocationStore(),
      logStore: new LogStore()
    }

    globalContext = createContext(gCtx)

    return (<>
      <globalContext.Provider value={gCtx}>
      <Stack.Navigator initialRouteName="Tabs">
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
      </Stack.Navigator>
      <UseLocationTracking />
      <LogUI />
      </globalContext.Provider>
    </>);
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