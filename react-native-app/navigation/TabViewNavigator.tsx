import React, { useContext } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { Button, Platform, Settings, StyleSheet, Text, View } from 'react-native';
import SnitchesView from '../views/SnitchesView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PeopleView from '../views/PeopleView/PeopleView';
import SettingsView from '../views/SettingsView';
import CurrentUserProfile from "../views/CurrentUserProfile";
import { globalContext } from "./appNavigator";
import { DeviceTokenType } from "../shared/models/User";
import ServerFacade from "../backend/ServerFacade";
import { authContext } from "./mainNavigator";

const TabViewNavigator : React.FC = () => {

    const ctx = useContext(globalContext);
    const atx = useContext(authContext);

    ctx.logStore.log("Curr Device Token: " + ctx.deviceToken);
    ctx.logStore.log("Curr User: " + ctx.currentUser.userId);
    ctx.logStore.log("Auth User: " + atx.authUser?.userId);

    if (!ctx.currentUser.associatedDeviceTokens) {
        ctx.logStore.log("ERROR: User has no ass. device tokens");
        if (ctx.deviceToken) {
          if (Platform.OS == 'ios') {
            ctx.currentUser.associatedDeviceTokens = {
              0: [ctx.deviceToken],
              1: []
            }
          } else if (Platform.OS = 'android') {
            ctx.currentUser.associatedDeviceTokens = {
              0: [],
              1: [ctx.deviceToken]
            }
          } else {
            throw new Error("Platform error...tabviewnav");
          }
          ServerFacade.updateUser(ctx.currentUser);
        } 
    } else {
      if (ctx.deviceToken) {
        if (Platform.OS == 'ios') {
          if (ctx.currentUser.associatedDeviceTokens[DeviceTokenType.APNS].indexOf(ctx.deviceToken) == -1) {
            ctx.currentUser.associatedDeviceTokens[DeviceTokenType.APNS].push(ctx.deviceToken);
          }
        } else if (Platform.OS == 'android') {
          if (ctx.currentUser.associatedDeviceTokens[DeviceTokenType.Google].indexOf(ctx.deviceToken) == -1) {
            ctx.currentUser.associatedDeviceTokens[DeviceTokenType.Google].push(ctx.deviceToken);
          }
        }
        ServerFacade.updateUser(ctx.currentUser);
      }
    }

    const Tab = createBottomTabNavigator();


    return (
    //<Navigator>
      <Tab.Navigator 
      initialRouteName="Profile"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";

            switch (route.name) {
              case "Snitches":
                iconName = 'campaign';
                break;
                
              case "Profile":
                iconName = 'person';
                break;

              case "People":
                iconName = 'people';
                break;
                
              case "Settings":
                iconName = 'settings';
                break;
            
              default:
                break;
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Snitches" component={SnitchesView}  options={{headerShown: false}} />
        <Tab.Screen name="Profile" component={CurrentUserProfile}  options={{headerShown: false}} />
        <Tab.Screen name="People" component={PeopleView}  options={{headerShown: false}} />
        <Tab.Screen name="Settings" component={SettingsView} />
      </Tab.Navigator>
    //</Navigator>

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

export default TabViewNavigator;