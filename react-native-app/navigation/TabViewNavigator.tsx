import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import SnitchesView from '../views/SnitchesView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PeopleView from '../views/PeopleView/PeopleView';
import SettingsView from '../views/SettingsView';
import CurrentUserProfile from "../views/CurrentUserProfile";

const TabViewNavigator : React.FC = () => {

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
        <Tab.Screen name="Settings" component={SettingsView}  options={{headerShown: false}} />
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