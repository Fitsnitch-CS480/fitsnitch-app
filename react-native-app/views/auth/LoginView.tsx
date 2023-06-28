import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authContext } from '../authWrapper';
import T from '../../assets/constants/text';
import Colors from '../../assets/constants/colors';
import AuthService from '../../services/AuthService';
import { isEmpty } from "lodash";
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

const LoginView: React.FC = () => {
	const navigation = useNavigation<any>();
	const [email, onChangeEmail] = useState('');
	const [password, onChangePassword] = useState('');
	const [error, setErrorMessage] = useState('');

	//Get user from Context from mainNavigator
	const { authUser, setAuthUser } = useContext(authContext);
	const [loading, setLoading] = useState<boolean>(false);

	// Currently unused
	const signInFunction = async () => {
		if (loading) return;
		setLoading(true);

		//If email and password are good, attempt login. Read errors and respond acordingly.
		if (email.length > 4 && password.length > 2) {
			try {
				let user = await AuthService.attemptLogin(email, password);
				// Setting the user will trigger a navigation to the rest of the app
				setLoading(false);
				setAuthUser(user);
			}
			catch (err: any) {
				console.log('Could not log in', err);
				setErrorMessage(err.message);
				setLoading(false)
				return;
			}
		}
		else {
			setErrorMessage(T.error.provideEmailPassword);
			setLoading(false)
		}
	};

	const signInWithGoogle = async () => {
		setLoading(true);
		try {
			const user: any = await AuthService.googleSignIn();
			setLoading(false);
			if (!isEmpty(user)) {
				setAuthUser(user);
			}
		} catch (error: any) {
			setLoading(false);
			console.log(error)
			setErrorMessage("Could not sign in with Google");
		}
	}

	return (
		<ScrollView style={styles.screen}>
			<View style={styles.container}>
				<Image
					source={require("../../assets/images/main_logo.png")}
					resizeMode="contain"
					style={styles.image}
				/>

				{/* Disabling email login for now */}
				{/* <View style={styles.materialUnderlineTextboxStack}>
					<TextInput placeholder={T.signUp.email} onChangeText={onChangeEmail} style={styles.textBox}></TextInput>
					<TextInput placeholder={T.signUp.password} secureTextEntry onChangeText={onChangePassword} style={styles.textBox}></TextInput>
				</View>
				
				<View style={styles.materialButtonPrimary}>
					{loading ?
						<ActivityIndicator color={Colors.red} size={30} />
						:
						<Button color={Colors.red} title={T.logIn.title} onPress={() => loading ? null : signInFunction()}></Button>
					}
				</View>
				*/}

				<View>
					<TouchableOpacity
						style={styles.buttonGoogleStyle}
						onPress={() => loading ? null : signInWithGoogle()}
						activeOpacity={0.5}>
						<Image
							source={require("../../assets/images/google.png")}
							style={styles.buttonImageIconStyle}
						/>
						<Text style={styles.buttonTextStyle}>
							{T.logIn.google}
						</Text>
					</TouchableOpacity>
					{/* Would like to keep the button code for now in case we need to switch to it from the code above*/}
					{/* <GoogleSigninButton
						style={{ width: 215, height: 48, margin: 25, borderRadius: 25 }}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Light}
						//   onPress={this._signIn}
						//   disabled={this.state.isSigninInProgress}
						/> */}
				</View>

				{loading &&
					<ActivityIndicator color={Colors.red} size={30} />
				}

				<View>
					<Text style={styles.errorMessage}>{error}</Text>
				</View>


				{/* <View style={styles.textContainer}>
					<Text style={styles.dontHaveAccount}>{T.logIn.dontHaveAccount}</Text>
					<Text style={styles.signUpText} onPress={() => navigation.navigate('signup')}>{T.signUp.title}</Text>
				</View> */}



			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	screen: {
		backgroundColor: Colors.background
	},
	materialButtonPrimary: {
		height: 36,
		width: 289,
		marginVertical: 20,
	},
	otherSignInButtons: {
		height: 36,
		width: 250,
		marginVertical: 20,
	},
	buttonGoogleStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.white,
		height: 40,
		borderRadius: 50,
		marginVertical: 20,
		width: 230,
		margin: 25,
		paddingHorizontal: 10,
	},
	buttonImageIconStyle: {
		width: 25,
		height: 25,
	},
	buttonTextStyle: {
		flexGrow: 1,
		fontWeight: "bold",
		textAlign: 'center'
	},
	textContainer: {
		flex: 2,
		flexDirection: 'row'
	},
	dontHaveAccount: {
		fontFamily: "roboto-regular",
		color: Colors.white,
		marginRight: 5,
		fontSize: 15,
	},
	signUpText: {
		fontFamily: "roboto-regular",
		fontSize: 15,
		fontWeight: 'bold',
		color: Colors.red,
	},
	materialUnderlineTextbox: {
		height: 43,
		width: 289,
		position: "absolute",
		left: 0,
		top: 0,
	},
	materialUnderlineTextboxStack: {
		width: 289,
		marginTop: 20
	},
	textBox: {
		backgroundColor: Colors.white,
		color: Colors.charcoal,
		borderRadius: 50,
		marginVertical: 5,
		paddingLeft: 20,
		height: 40
	},
	image: {
		height: 200,
		width: 200,
		marginTop: 50,
		marginBottom: 25,
	},
	materialUnderlineTextbox1: {
		height: 43,
		width: 289,
	},
	errorMessage: {
		color: Colors.red,
	}
});

export default LoginView;