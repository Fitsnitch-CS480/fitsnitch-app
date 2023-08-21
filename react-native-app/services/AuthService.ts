import User from "../shared/models/User";
import ServerFacade, { request } from "./ServerFacade";
import NativeModuleService from "./NativeModuleService";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const AuthService = {

	async emailSignUp(user: any) {
		try {
			const userCredential = await auth().createUserWithEmailAndPassword(user.email, user.password);
			userCredential.user.sendEmailVerification();
			const data: any = auth().currentUser;
			if (data?.uid) {
				const pendingUser = {
					pendingUserId: data.uid,
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					phone: user?.phoneNumber,
				}
				await request.post('/user/create-pending', pendingUser);
			}
		}
		catch (error: any) {
			let errorMessage = '';
			if (error.code === 'auth/email-already-in-use') {
				errorMessage = 'That email address is already in use!';
			}

			if (error.code === 'auth/invalid-email') {
				errorMessage = "Invalid email!";
			}

			console.error(error);
			throw new Error(errorMessage);
		};
	},

	async attemptEmailLogin(email: string, password: string): Promise<User | undefined> {
		try {
			await auth().signInWithEmailAndPassword(email, password)
		}
		catch (e: any) {
			let errorMessage = 'Unknown error';
			if (e.code === 'auth/user-not-found') {
				errorMessage = "Email not recognized!";
			}
			if (e.code === 'auth/invalid-email') {
				errorMessage = "Invalid email!";
			}
			if (e.code === 'auth/wrong-password') {
				errorMessage = "Invalid password";
			}
			if (e.code === 'auth/too-many-requests') {
				errorMessage = "Too many failed attempts. This account has been locked.";
			}
			console.log(e, e.code)
			throw new Error(errorMessage);
		}
		const userAuth = auth().currentUser;
		if (!userAuth) return;

		console.log('User is authenticated, loading from DB');
		console.log(userAuth)

		try {
			let user = await ServerFacade.getUserById(userAuth.uid);
			if (user) {
				return user;
			}
			// The user might not exist because it is still pending.
			// Confirm user from pending state
			const { data } = await request.post('/user/confirm-pending', { pendingUserId: userAuth.uid });
			if ( data.success ) {
				return data.data;
			}
			else console.log("Could not find user or pending user");
		}
		catch (e) {
			console.log(e);
		}
	},

	async googleSignIn() {
		GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
		const googleUser = await GoogleSignin.signIn();
		const googleCredential = auth.GoogleAuthProvider.credential(googleUser.idToken);
		try {
			const data = await auth().signInWithCredential(googleCredential)
			let user = await ServerFacade.getUserById(data?.user?.uid);
			if (user) {
				// Attempt to update user photo
				if (user.image !== googleUser.user.photo) {
					console.log("Updating user image:", googleUser.user.photo)
					user.image = googleUser.user.photo || "";
					await ServerFacade.updateUser(user);
				}
			}
			if (!user) {
				// Assume this is the user's first log in after verification
				// They must be added to db
				// ServerFacade.createUser(new User(userAuth.uid, userAuth.email))
				console.log("User does not exist - creating new account")
				user = {
					userId: data?.user?.uid,
					email: googleUser.user.givenName || "",
					firstname: googleUser.user.givenName || "",
					lastname: googleUser.user.familyName || "",
					phone: data?.user?.phoneNumber || "",
					image: googleUser.user.photo || "",
				}
				await ServerFacade.createUser(user);
			}
			return user;
		}
		catch (error: any) {
			console.log("Error on Google sign in: ", { error });
			const tokens = await GoogleSignin.getTokens();
			await GoogleSignin.clearCachedAccessToken(tokens.accessToken || '');
			await GoogleSignin.signOut();
			throw new Error(error);
		}
	},

	async resendConfirmationEmail() {
		return await auth().currentUser?.sendEmailVerification()
			.then(async () => { })
			.catch(error => {
				console.log(error)
				console.log(error.code)
				throw new Error("Error sending verification email.");
			});
	},

	async logout() {
		await auth().signOut();
		await GoogleSignin.signOut();
		await NativeModuleService.getModule().stopBackgroundLocation();
	}
}

export default AuthService;