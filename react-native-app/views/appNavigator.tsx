import React, { useContext, useEffect } from "react";
import OtherUserProfile from './profile/OtherUserProfile';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import User from "../shared/models/User";
import { NativeInput } from "../models/NativeInput";
import LogUI from "./LogUI";
import TabViewNavigator from "./homeNavigator";
import UserSearch from "./UserSearch";
import NativeModuleService from "../services/NativeModuleService";
import GetSnitchedView from "./GetSnitchedView";
import Colors from "../assets/constants/colors";
import PushNotificationService from "../services/PushNotificationService";
import PermissionCheckBanner from "./PermissionCheckBanner";
import { globalContext } from "./GlobalContext";
import { observer } from "mobx-react-lite";
import FirstLaunch from "./FirstLaunch";
import { ActivityIndicator, View } from "react-native";

type props = {
	input?: NativeInput
}

const AppNavigator = observer<props>(({ input }) => {
	const {userStore} = useContext(globalContext);
	const currentUser = userStore.currentUser;

	NativeModuleService.getModule().saveUserId(currentUser.userId);

	let START_SCREEN = 'Tabs';
	let snitchProps = {};

	if (input?.ACTION === 'START_SNITCH') {
		console.log("GOT SNITCH INPUT!!!")
		START_SCREEN = 'GetSnitchedOn';

		snitchProps = {
			trigger: Date.now(),
		}
	}

	if (input?.ACTION === 'DID_SNITCH') {
		START_SCREEN = 'Tabs';
	}

	const Stack = createNativeStackNavigator();

	useEffect(() => {
		PushNotificationService.init(currentUser.userId);
		NativeModuleService.init();
	}, []);


	const SnitchView = observer<any>((props) => {
		return <GetSnitchedView {...snitchProps} {...props} />
	})

	if (!userStore.userStorage) {
		return <View style={{ marginVertical: '50%' }} >
			<ActivityIndicator color={Colors.red} size={50} />
		</View>
	}


	if (!userStore.userStorage.didFirstLaunch) {
		return <FirstLaunch />
	}

	return (<>
		<PermissionCheckBanner />
		<Stack.Navigator initialRouteName={START_SCREEN}>
			<Stack.Screen name="Tabs" component={TabViewNavigator}
				options={{ headerShown: false }} />
			<Stack.Screen name="Search" component={UserSearch}
				options={{
					headerShown: true,
					headerStyle: {
						backgroundColor: Colors.background,
					},
					headerTitleStyle: {
						color: Colors.white
					},
					headerTintColor: Colors.white
				}} />
			<Stack.Screen
				name="OtherUserProfile"
				component={OtherUserProfile}
				options={({ route }) => {
					let { profileOwner } = route.params as any;
					return {
						headerShown: true,
						headerTitle: `${profileOwner?.firstname}'s Profile` || "Profile",
						headerStyle: {
							backgroundColor: Colors.background,
						},
						headerTitleStyle: {
							color: Colors.white
						},
						headerTintColor: Colors.white
					};
				}} />
			<Stack.Screen
				name="GetSnitchedOn"
				options={{ title: "Snitch Warning" }}
				component={SnitchView} />
		</Stack.Navigator>

		<LogUI />
	</>);
})

export default AppNavigator;
