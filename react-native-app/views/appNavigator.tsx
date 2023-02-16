import React, { createContext, useState } from "react";
import OtherUserProfile from './profile/OtherUserProfile';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import User from "../shared/models/User";
// import LocationStore from "../stores/LocationStore";
import LogStore from "../stores/LogStore";
import { ClientStore, PartnerStore, TrainerStore } from "../stores/PeopleStores";
import { PartnerRequestForUserStore, TrainerRequestForUserStore } from "../stores/RequestStores";
import { getMetaData, NativeInput } from "../models/NativeInput";
import SnitchEvent from "../shared/models/SnitchEvent";
import { LatLonPair } from "../shared/models/CoordinateModels";
import LogUI from "./LogUI";
import TabViewNavigator from "./homeNavigator";
import UserSearch from "./UserSearch";
import NativeModuleService from "../services/NativeModuleService";
import GetSnitchedView from "./GetSnitchedView";
import Colors from "../assets/constants/colors";

type props = {
	authUser?: User,
	input?: NativeInput
}

export var globalContext: React.Context<{
	currentUser: User,
	// locationStore: LocationStore
	logStore: LogStore,
	partnerStore: PartnerStore,
	clientStore: ClientStore,
	trainerStore: TrainerStore,
	trainerRequestsForUser: TrainerRequestForUserStore,
	partnerRequestsForUser: PartnerRequestForUserStore,
}>;

const AppNavigator: React.FC<props> = ({ authUser, input }) => {
	if (!authUser) return null;

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

	const gCtx = {
		currentUser: authUser,
		// locationStore: new LocationStore(),
		logStore: new LogStore(),
		partnerStore: new PartnerStore(authUser),
		clientStore: new ClientStore(authUser),
		trainerStore: new TrainerStore(authUser),
		trainerRequestsForUser: new TrainerRequestForUserStore(authUser),
		partnerRequestsForUser: new PartnerRequestForUserStore(authUser)
	}

	globalContext = createContext(gCtx)

	const SnitchView: React.FC<any> = (props) => {
		return <GetSnitchedView {...snitchProps} {...props} />
	}

	NativeModuleService.init();

	return (<>
		<globalContext.Provider value={gCtx}>

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
				<Stack.Screen name="OtherUserProfile"
					component={OtherUserProfile}
					options={({ route }) => {
						let { profileOwner } = route.params as any;
						return {
							headerTitle: `${profileOwner?.firstname}'s Profile` || "Profile"
						};
					}} />
				<Stack.Screen
					name="GetSnitchedOn"
					options={{ title: "Snitch Warning" }}
					component={SnitchView} />
			</Stack.Navigator>

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