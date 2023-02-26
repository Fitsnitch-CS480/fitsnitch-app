import User from "../shared/models/User";
import ServerFacade from "./ServerFacade";
import EncryptedStorage from 'react-native-encrypted-storage';
import NativeModuleService from "./NativeModuleService";
import { isEmpty } from "lodash";

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

	async attemptSignUp(data:any):Promise<string> {
		try {
			return await ServerFacade.signUp(data);
		} catch {
			throw new Error("Error on sign up. Please try again.");
		}

	},

	async attemptLogin(email:string, password:string): Promise<User | undefined> {
		const data = {
			username: email,
			password
		}

		let userCognitoData:any = await ServerFacade.login(data);

		if (isEmpty(userCognitoData)) {
			// throw new Error("Failed to authenticate with given credentials");
			return undefined;
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

	async logout(username) {
		await ServerFacade.logout(username);
		await EncryptedStorage.removeItem("user_auth");
		NativeModuleService.getModule().stopBackgroundLocation();
	}
}

export default AuthService;