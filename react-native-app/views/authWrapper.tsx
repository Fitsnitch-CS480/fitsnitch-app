import React, { createContext, useContext, useEffect, useState } from "react";
import AppNavigator from "./appNavigator";
import { NavigationContainer } from "@react-navigation/native";
import User from "../shared/models/User";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { NativeInput } from "../models/NativeInput";
import LoginNavigator from "./auth/loginNavigator";
import Colors from "../assets/constants/colors";
import auth from '@react-native-firebase/auth';
import ServerFacade from "../services/ServerFacade";
import { globalContext } from "./GlobalContext";
import { observer } from "mobx-react-lite";

const AuthWrapper = observer<{ input?: NativeInput }>(({ input }) => {
	const { setCurrentUser, userStore } = useContext(globalContext);
	const [initializing, setInitializing] = useState(true);
	const currentUser = userStore.currentUser;

	const onAuthStateChanged = async (user: any) => {
		if (user === null) {
			setCurrentUser(null);
			setInitializing(false);
			return;
		}

		if(user.emailVerified) {
			const loggedInUser = await ServerFacade.getUserById(user.uid);
			if (loggedInUser) {
				setCurrentUser(loggedInUser);
			}
			else {
				console.error("Authenticated as unknown user. Could not find user ID in DB!")
				console.log(user);
			}
		}
		setInitializing(false);
	}

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, [])

	if (initializing) {
		return (
			<View style={styles.loadingScreen}>

				<Image
					source={require("../assets/images/main_logo.png")}
					resizeMode="contain"
					style={styles.image}
				></Image>
				<ActivityIndicator color={Colors.red} size={30} />
			</View>
		)
	}

	const canEnter = Boolean(currentUser);

	//If user is logged in, go to normal app screens. If not, go to the login screens. 
	return (
		<NavigationContainer>
			{canEnter ? <AppNavigator input={input} /> : <LoginNavigator />}
		</NavigationContainer>
	)
})

const styles = StyleSheet.create({
	loadingScreen: {
		flex: 1,
		alignItems: 'center',
		justifyContent: "center",
		backgroundColor: Colors.background,
	},
	image: {
		height: 200,
		width: 200,
		marginBottom: 50
	},
})

export default AuthWrapper;