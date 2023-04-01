import User from "../shared/models/User";
import ServerFacade from "./ServerFacade";
import NativeModuleService from "./NativeModuleService";
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { isEmpty } from "lodash";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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

	async googleSignIn() {
		GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
		const { idToken } = await GoogleSignin.signIn();
		const googleCredential = auth.GoogleAuthProvider.credential(idToken);
		return auth().signInWithCredential(googleCredential).then(async (data)=>{
			const name = data.user?.displayName;
			const nameArray: any = name?.split(' ');
			let firstname = '';
			let lastname = '';
			if(!isEmpty(nameArray)){
				firstname = nameArray[0];
				if(nameArray.length === 2){
					lastname = nameArray[1];
				}
			}
			const input:User = {
				userId: data.user?.uid,
				email: data.user.email || "",
				firstname: firstname,
				lastname: lastname,
				phone: data.user?.phoneNumber || "",
			}
			console.log("input: ", input)
			return await ServerFacade.createUser(input);
		})
		.catch((error)=> {
			console.log("Error on Google sing in: ", {error});
			throw new Error(error);
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