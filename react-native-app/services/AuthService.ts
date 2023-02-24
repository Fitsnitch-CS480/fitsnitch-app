import User from "../shared/models/User";
import ServerFacade from "./ServerFacade";
import Auth from '@aws-amplify/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import NativeModuleService from "./NativeModuleService";

const AuthService = {
	async attemptResumeSession(): Promise<User | undefined> {
		{ }
		const authentication = await EncryptedStorage.getItem("user_auth");
		// console.log("authentication JSON:", authentication)
		if (!authentication) {
			console.log("No previous session identified.");
			return;
		}

		const { email, password } = JSON.parse(authentication);
		console.log("Found previous user:", email)

		return await this.attemptLogin(email, password);
	},

	async attemptLogin(email, password): Promise<User | undefined> {
		const data = {
			username: email,
			password
		}
		let userCognitoData = await ServerFacade.login(data);
		if (!userCognitoData) {
			throw new Error("Failed to authenticate with given credentials");
		}
		// Use the UserID from Cognito to look up the User in our DB
		let user = await ServerFacade.getUserById(userCognitoData.userId);
		if (!user) {
			throw new Error("Found no user matching credentials");
		}
		try {
			await EncryptedStorage.setItem(
				"user_auth",
				JSON.stringify({
					email,
					password
				})
			);
			NativeModuleService.getModule()?.saveUserId(user.userId);
		} catch (error) {
			console.log('Failed to save login: ', error);
		}
		return user;
	},

	async logout() {
		await Auth.signOut();
		await EncryptedStorage.removeItem("user_auth");
		NativeModuleService.getModule().stopBackgroundLocation();
	}
}

export default AuthService;