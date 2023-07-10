import React, { useContext, useEffect } from "react";
import { globalContext } from "./GlobalContext";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import MatButton from "../components/MatButton";
import Colors from "../assets/constants/colors";
import NativeModuleService from "../services/NativeModuleService";

const FirstLaunch = observer(() => {
	const {userStore} = useContext(globalContext);
	const currentUser = userStore.currentUser;

	const acceptAndContinue = async () => {
		await NativeModuleService.checkPermissions();
		userStore.updateUserStorage({acceptedLocation: true})
	}

	return (
		<View style={style.container}>
			<Text style={style.heading}>Welcome to FitSnitch!</Text>
			<Text style={style.p}>
				FitSnitch accesses your current location to help ypu keep your fitness goals even when the app is closed.
			</Text>
			<Text style={style.p}>
				To continue, please grant background location access.
			</Text>
			<View style={style.gap} />
			<MatButton
				title="Continue"
				color={Colors.lightBlue}
				onPress={acceptAndContinue}
			/>
		</View>
	);
})

const style = StyleSheet.create({
	container: {
		padding: 40,
		display: 'flex',
		height: '100%'
	},
	heading: {
		fontSize: 28,
		marginBottom: 50,
		fontWeight: 'bold',
		color: 'white',
	},
	p: {
		color: 'white',
		marginVertical: 10,
		fontSize: 16
	},
	gap: {
		flexGrow: 1
	},
	footer: {
		display: 'flex',
		justifyContent: 'flex-end'
	}
});

export default FirstLaunch;
