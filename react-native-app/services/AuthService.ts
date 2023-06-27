import User from "../shared/models/User";
import ServerFacade from "./ServerFacade";
import NativeModuleService from "./NativeModuleService";
import auth from '@react-native-firebase/auth';
import { isEmpty } from "lodash";

const AuthService = {
	async signUp(user: any) {

		 await auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(async (userCredential) => {
          userCredential.user.sendEmailVerification();
		  const data:any = auth().currentUser;
		  let input: User;
		  if(!isEmpty(data)){
			input = {
				userId: data.uid,
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				phone: user?.phoneNumber,
			}
			await ServerFacade.createUser(input);
		  }
        })
        .catch(error => {
			let errorMessage = '';
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'That email address is already in use!';
          }

          if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email!";
          }

          console.error(error);
		  throw new Error(errorMessage);
        });
	},

	async attemptLogin(email:string, password:string): Promise<User | undefined> {
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
			console.log(e, e.code)
			throw new Error(errorMessage);
		}
		const userAuth:any = auth().currentUser;
		console.log('User is authenticated, loading from DB');
		
		try {
			console.log(userAuth)
			let user = await ServerFacade.getUserById(userAuth.uid);
			if (!user) {
				// Assume this is the user's first log in after verification
				// They must be added to db
				// ServerFacade.createUser(new User(userAuth.uid, userAuth.email))
				throw new Error("User is not verified");
			}
			return user;
		}
		catch (e) {
			console.log(e);

		}
	},

	async resendConfirmationEmail()  {
		return await auth().currentUser?.sendEmailVerification()
		.then(async () => {})
		.catch(error => {
			console.log(error)
			console.log(error.code)
			throw new Error("Error sending verification email.");
		});
	  },

	async logout() {
		await auth().signOut();
		NativeModuleService.getModule().stopBackgroundLocation();
	}
}

export default AuthService;