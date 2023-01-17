import React from "react";
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import SnitchesView from '../views/SnitchesView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PeopleView from '../views/PeopleView/PeopleView';
import SettingsView from '../views/SettingsView';
import Colors from '../assets/constants/colors';
import CurrentUserProfile from "./profile/CurrentUserProfile";

const HomeNavigator: React.FC = () => {

	const Tab = createBottomTabNavigator();

	return (
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
				tabBarActiveTintColor: 'white',
				tabBarInactiveTintColor: 'black',
				tabBarActiveBackgroundColor: Colors.darkRed,
				tabBarInactiveBackgroundColor: Colors.red
			})}
		>
			<Tab.Screen name="Snitches" component={SnitchesView} options={{ headerShown: false }} />
			<Tab.Screen name="Profile" component={CurrentUserProfile} options={{ headerShown: false }} />
			<Tab.Screen name="People" component={PeopleView} options={{ headerShown: false }} />
			<Tab.Screen name="Settings" component={SettingsView}
				options={{
					headerShown: true,
					headerStyle: {
						backgroundColor: Colors.background,
					},
					headerTitleStyle: {
						color: Colors.white
					}
				}}
			/>
		</Tab.Navigator>
	);
}

export default HomeNavigator;