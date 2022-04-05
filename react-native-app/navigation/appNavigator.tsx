import React, { createContext, useState } from "react";
import OtherUserProfile from '../views/OtherUserProfile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabViewNavigator from "./TabViewNavigator";
import UserSearch from "../views/UserSearch";
import { Button, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetSnitchedView from "../views/GetSnitchedView";
import User from "../shared/models/User";
import LocationStore from "../stores/LocationStore";
import UseLocationTracking from "../hooks/useLocationTracking";
import LogUI from "../components/LogUI";
import LogStore from "../stores/LogStore";
import {ClientStore, PartnerStore, TrainerStore} from "../stores/PeopleStores";
import { PartnerRequestForUserStore, TrainerRequestForUserStore } from "../stores/RequestStores";

type props = {
  authUser: User,
  deviceToken: string|null
}

export var globalContext: React.Context<{
  currentUser: User,
  locationStore: LocationStore
  logStore: LogStore,
  partnerStore: PartnerStore,
  clientStore: ClientStore,
  trainerStore: TrainerStore,
  trainerRequestsForUser: TrainerRequestForUserStore,
  partnerRequestsForUser: PartnerRequestForUserStore,
  deviceToken: string|null
}>;

const AppNavigator : React.FC<props> = ({authUser, deviceToken}) => {
  if (!authUser) return null;
    
    const Stack = createNativeStackNavigator();

    const gCtx = {
      currentUser: authUser,
      locationStore: new LocationStore(),
      logStore: new LogStore(),
      partnerStore: new PartnerStore(authUser),
      clientStore: new ClientStore(authUser),
      trainerStore: new TrainerStore(authUser),
      trainerRequestsForUser: new TrainerRequestForUserStore(authUser),
      partnerRequestsForUser: new PartnerRequestForUserStore(authUser),
      deviceToken: deviceToken
    }

    globalContext = createContext(gCtx)

    return (<>
      <globalContext.Provider value={gCtx}>
      
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Tabs" component={TabViewNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={UserSearch} />
        <Stack.Screen name="OtherUserProfile"
          component={OtherUserProfile}
          options={({ route }) => {
            let { profileOwner } = route.params as any;
            return {
              headerTitle: `${profileOwner?.firstname}'s Profile` || "Profile"
            };
          } } />
        <Stack.Screen name="GetSnitchedOn" options={{title:"Snitch Warning"}} component={GetSnitchedView} />
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