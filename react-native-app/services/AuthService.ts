import User from "../shared/models/User";
import ServerFacade from "./ServerFacade";
import NativeModuleService from "./NativeModuleService";
import auth from '@react-native-firebase/auth';
import { isEmpty } from "lodash";

const AuthService = {
	async signUp(user: any) {
		console.log("STEP 2.5", {user})
		 

		 await auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(async (userCredential) => {
          console.log('User account created & signed in!');
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
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
	},

	async attemptLogin(email:string, password:string): Promise<User | undefined> {
		return await auth()
			.signInWithEmailAndPassword(email, password)
			.then(async () => {
				const input:any = auth().currentUser;
				console.log("Log in user: ", input);
				console.log('User account created & signed in!');
				return await ServerFacade.getUserById(input.uid);
			})
			.catch(error => {
				if (error.code === 'auth/email-already-in-use') {
					console.log('That email address is already in use!');
				}

				if (error.code === 'auth/invalid-email') {
				console.log('That email address is invalid!');
				}

				console.error(error);
				return undefined;
			});
	},

	async resendConfirmationEmail()  {
		try{
			await auth().currentUser?.sendEmailVerification();
		} catch(error){
			console.log({error})
		}
	  },

	async logout() {
		await auth().signOut();
		// NativeModuleService.getModule().stopBackgroundLocation();
	}
}

export default AuthService;