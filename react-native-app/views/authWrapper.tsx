import React, { createContext, useEffect, useState } from "react";
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

export const authContext = createContext<{ setAuthUser: (user: User | undefined) => void, authUser: User | undefined }>({ authUser: undefined, setAuthUser: () => { } });

const AuthWrapper: React.FC<{ input?: NativeInput }> = ({ input }) => {
	const [initializing, setInitializing] = useState(true);
	const [authUser, setAuthUser] = useState<User | undefined>(undefined);
	const onAuthStateChanged = async (user: any) => {
		console.log("user details: ", user)
		if (user === null){
			user = undefined;
			setAuthUser(user);
		}

		if(!isEmpty(user)){
			const loggedInUser = await ServerFacade.getUserById(user.uid);
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
		<authContext.Provider value={{ authUser, setAuthUser }}>
			<NavigationContainer>
				{authUser !== undefined ? <AppNavigator input={input} authUser={authUser} /> : <LoginNavigator />}
			</NavigationContainer>
		</authContext.Provider>
	)
}

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