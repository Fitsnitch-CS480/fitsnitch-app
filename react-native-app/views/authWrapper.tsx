import React, { createContext, useEffect, useState } from "react";
import AppNavigator from "./appNavigator";
import { NavigationContainer } from "@react-navigation/native";
import User from "../shared/models/User";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { NativeInput } from "../models/NativeInput";
import LoginNavigator from "./auth/loginNavigator";
import Colors from "../assets/constants/colors";
import AuthService from "../services/AuthService";
import { isEmpty } from "lodash";

export const authContext = createContext<{ setAuthUser: (user: User | undefined) => void, authUser: User | undefined }>({ authUser: undefined, setAuthUser: () => { } });

const AuthWrapper: React.FC<{ input?: NativeInput }> = ({ input }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [authUser, setAuthUser] = useState<User | undefined>(undefined);

	const componentDidMount = async () => {
		try {
			let user = await AuthService.attemptResumeSession();
			if (user) setAuthUser(user);
		}
		catch (error) {
			console.log('Failed persistent login: ', error);
		}
		setLoading(false)
	}

	useEffect(() => {
		componentDidMount();
	}, [])

	if (loading) {
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
				{!isEmpty(authUser) ? <AppNavigator input={input} authUser={authUser} /> : <LoginNavigator />}
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