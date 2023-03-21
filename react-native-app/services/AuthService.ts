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
		return await auth()
			.signInWithEmailAndPassword(email, password)
			.then(async () => {
				const input:any = auth().currentUser;
				console.log('User account created & signed in!');
				return await ServerFacade.getUserById(input.uid);
			})
			.catch(error => {
				let errorMessage = '';
				if (error.code === 'auth/user-not-found') {
					errorMessage = "Email not recognized!";
				}
				if (error.code === 'auth/invalid-email') {
					errorMessage = "Invalid email!";
				}
				if (error.code === 'auth/wrong-password') {
					errorMessage = "Invalid password";
				}
				console.log(error.code)
				throw new Error(errorMessage);
			});
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
		// NativeModuleService.getModule().stopBackgroundLocation();
	}
}

export default AuthService;