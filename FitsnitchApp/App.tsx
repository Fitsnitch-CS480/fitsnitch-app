import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import SnitchesView from './views/SnitchesView';
import UserProfileView from './views/UserProfileView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PeopleView from './views/PeopleView';
import SettingsView from './views/SettingsView';

const Hello: React.FC = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
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
        <Tab.Screen name="Snitches" component={SnitchesView} />
        <Tab.Screen name="Profile" component={UserProfileView} />
        <Tab.Screen name="People" component={PeopleView} />
        <Tab.Screen name="Settings" component={SettingsView} />
      </Tab.Navigator>
    </NavigationContainer>

  );
};

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

export default Hello;