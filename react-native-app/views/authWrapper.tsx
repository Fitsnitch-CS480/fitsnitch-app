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
import { isEmpty } from "lodash";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { globalContext } from "./GlobalContext";
import { observer } from "mobx-react-lite";

GoogleSignin.configure({
	webClientId: "1037844578161-20ie56l06g6h78tr1b4fjob40jfgvso2.apps.googleusercontent.com",
});


const AuthWrapper = observer<{ input?: NativeInput }>(({ input }) => {
	const { setCurrentUser } = useContext(globalContext);
	const [initializing, setInitializing] = useState(true);
	const [authUser, setAuthUser] = useState<User | undefined>(undefined);

	const onAuthStateChanged = async (user: any) => {
		if (user === null) {
			setAuthUser(undefined);
		}

		if (!isEmpty(user)) {
			const loggedInUser = await ServerFacade.getUserById(user.uid);
			setCurrentUser(loggedInUser);
			setAuthUser(loggedInUser);
		}

		if (initializing) setInitializing(false);
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

	//If user is logged in, go to normal app screens. If not, go to the login screens. 
	return (
		<NavigationContainer>
			{authUser !== undefined ? <AppNavigator input={input} /> : <LoginNavigator />}
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