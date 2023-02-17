import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authContext } from '../authWrapper';
import T from '../../assets/constants/text';
import Colors from '../../assets/constants/colors';
import AuthService from '../../services/AuthService';
import {
    AuthenticationDetails,
    CognitoUserPool,
    CognitoUser,
    CognitoUserAttribute,
    ICognitoUserAttributeData,
    ISignUpResult,
    CognitoUserSession,
  } from 'amazon-cognito-identity-js';
import PoolData from '../../services/PoolData';
import * as AWS from 'aws-sdk/global';
import ServerFacade from '../../services/ServerFacade';


export default function LoginView() {
	const navigation = useNavigation<any>();
	const [email, onChangeEmail] = useState('');
	const [password, onChangePassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	//Get user from Context from mainNavigator
	const { authUser, setAuthUser } = useContext(authContext);
	const [loading, setLoading] = useState<boolean>(false);

	const signInFunction = async () => {
		if (loading) return;
		setLoading(true);
		const userPool = new CognitoUserPool(PoolData);
		//If email and password are good, attempt login. Read errors and respond acordingly.
		if (email.length > 4 && password.length > 2) {
			try {
				console.log("step 1: ", {userPool});
				let cognitoUser = await new CognitoUser({Username: email, Pool: userPool});
				const authenticationData = {Username: email, Password: password};

          		const authenticationDetails = new AuthenticationDetails(authenticationData);
				  console.log("step 2: ", {authenticationDetails});
				  console.log("step 2 User: ", {cognitoUser});
				  cognitoUser.authenticateUser(authenticationDetails, {
					onSuccess: function(result) {
						var accessToken = result.getAccessToken().getJwtToken();
				
						//POTENTIAL: Region needs to be set if not already set previously elsewhere.
						AWS.config.region = 'us-west-2';
				
						AWS.config.credentials = new AWS.CognitoIdentityCredentials({
							IdentityPoolId: 'us-west-2:03ac486c-aca1-488a-925e-987a07cdc390', // your identity pool id here
							Logins: {
								// Change the key below according to the specific region your user pool is in.
								'cognito-idp.us-west-2.amazonaws.com/us-west-2_F1H5RIyOe': result
									.getIdToken()
									.getJwtToken(),
							},
						});
						console.log("step 3: ", {authenticationDetails});
						//refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
						(AWS.config.credentials as AWS.CognitoIdentityCredentials).refresh(error => {
							if (error) {
								console.error(error);
							} else {
								// Instantiate aws sdk service objects now that the credentials have been updated.
								// example: var s3 = new AWS.S3();
								console.log("result", {result});
								console.log('Successfully logged!');
								cognitoUser.getUserAttributes(async (err, result:any) => {
									if (err) {
										Alert.alert(err.message || JSON.stringify(err));
										return;
									}
									let tempUser:any = {id: '', email: ''};
									for (let i = 0; i < result.length; i++) {
										console.log(
											'attribute ' + result[i].getName() + ' has value ' + result[i].getValue()
										);
										const field = result[i].getName();
										const value = result[i].getValue();
										if(field === 'sub'){
											tempUser = {
												...tempUser,
												id: value
											}
										}
										if(field === 'email'){
											tempUser = {
												...tempUser,
												email: value
											}
										}
									}
									console.log("user result", {tempUser});
									console.log("user result ", tempUser.id);
									const user = await ServerFacade.getUserById(tempUser.email);
									setLoading(false);
									setAuthUser(user);
								});
								
								// setAuthUser(result);
							}
						});
					},
				
					onFailure: function(err) {
						console.log("step Err: ", {err});
						Alert.alert(err.message || JSON.stringify(err));
						setLoading(false);
					},
				});
				// let user = await AuthService.attemptLogin(email, password);
				// Setting the user will trigger a navigation to the rest of the app
				// setLoading(false);
				// setAuthUser(user);
			}
			catch (err:any) {
				if (err.code === 'UserNotConfirmedException') {
					console.log('User not confirmed');
					navigation.navigate('confirmation', {
						email,
					});
					setLoading(false);
				}
				else {
					console.log('Could not log in', err);
					Alert.alert(T.error.noLogIn, err.message);
				}
				setLoading(false)
			}
		}
		else {
			Alert.alert("", T.error.provideEmailPassword);
			setLoading(false)
		}
	};

	return (
		<ScrollView style={styles.screen}>
			<View style={styles.container}>
				<Image
					source={require("../../assets/images/main_logo.png")}
					resizeMode="contain"
					style={styles.image}
				/>

				<View style={styles.materialUnderlineTextboxStack}>
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

				<View style={styles.textContainer}>
					<Text style={styles.dontHaveAccount}>{T.logIn.dontHaveAccount}</Text>
					<Text style={styles.signUpText} onPress={() => navigation.navigate('signup')}>{T.signUp.title}</Text>
				</View>
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
		marginTop: 50
	},
	materialUnderlineTextbox1: {
		height: 43,
		width: 289,
	}
});
// import React, { useContext, useEffect, useState } from 'react';
// import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Platform, ActivityIndicator, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { authContext } from '../authWrapper';
// import T from '../../assets/constants/text';
// import Colors from '../../assets/constants/colors';
// import AuthService from '../../services/AuthService';

// export default function LoginView() {
// 	const navigation = useNavigation<any>();
// 	const [email, onChangeEmail] = useState('');
// 	const [password, onChangePassword] = useState('');
// 	const [errorMessage, setErrorMessage] = useState('');

// 	//Get user from Context from mainNavigator
// 	const { authUser, setAuthUser } = useContext(authContext);
// 	const [loading, setLoading] = useState<boolean>(false);

// 	const signInFunction = async () => {
// 		if (loading) return;
// 		setLoading(true);

// 		//If email and password are good, attempt login. Read errors and respond acordingly.
// 		if (email.length > 4 && password.length > 2) {
// 			try {
// 				let user = await AuthService.attemptLogin(email, password);
// 				// Setting the user will trigger a navigation to the rest of the app
// 				setLoading(false);
// 				setAuthUser(user);
// 			}
// 			catch (err:any) {
// 				if (err.code === 'UserNotConfirmedException') {
// 					console.log('User not confirmed');
// 					navigation.navigate('confirmation', {
// 						email,
// 					});
// 				}
// 				else {
// 					console.log('Could not log in', err);
// 					Alert.alert(T.error.noLogIn, err.message);
// 				}
// 				setLoading(false)
// 			}
// 		}
// 		else {
// 			Alert.alert("", T.error.provideEmailPassword);
// 			setLoading(false)
// 		}
// 	};

// 	return (
// 		<ScrollView style={styles.screen}>
// 			<View style={styles.container}>
// 				<Image
// 					source={require("../../assets/images/main_logo.png")}
// 					resizeMode="contain"
// 					style={styles.image}
// 				/>

// 				<View style={styles.materialUnderlineTextboxStack}>
// 					<TextInput placeholder={T.signUp.email} onChangeText={onChangeEmail} style={styles.textBox}></TextInput>
// 					<TextInput placeholder={T.signUp.password} secureTextEntry onChangeText={onChangePassword} style={styles.textBox}></TextInput>
// 				</View>

// 				<View style={styles.materialButtonPrimary}>
// 					{loading ?
// 						<ActivityIndicator color={Colors.red} size={30} />
// 						:
// 						<Button color={Colors.red} title={T.logIn.title} onPress={() => loading ? null : signInFunction()}></Button>
// 					}
// 				</View>

// 				<View style={styles.textContainer}>
// 					<Text style={styles.dontHaveAccount}>{T.logIn.dontHaveAccount}</Text>
// 					<Text style={styles.signUpText} onPress={() => navigation.navigate('signup')}>{T.signUp.title}</Text>
// 				</View>
// 			</View>
// 		</ScrollView>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		display: 'flex',
// 		flexDirection: 'column',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},
// 	screen: {
// 		backgroundColor: Colors.background
// 	},
// 	materialButtonPrimary: {
// 		height: 36,
// 		width: 289,
// 		marginVertical: 20,
// 	},
// 	textContainer: {
// 		flex: 2,
// 		flexDirection: 'row'
// 	},
// 	dontHaveAccount: {
// 		fontFamily: "roboto-regular",
// 		color: Colors.white,
// 		marginRight: 5,
// 		fontSize: 15,
// 	},
// 	signUpText: {
// 		fontFamily: "roboto-regular",
// 		fontSize: 15,
// 		fontWeight: 'bold',
// 		color: Colors.red,
// 	},
// 	materialUnderlineTextbox: {
// 		height: 43,
// 		width: 289,
// 		position: "absolute",
// 		left: 0,
// 		top: 0,
// 	},
// 	materialUnderlineTextboxStack: {
// 		width: 289,
// 		marginTop: 20
// 	},
// 	textBox: {
// 		backgroundColor: Colors.white,
// 		color: Colors.charcoal,
// 		borderRadius: 50,
// 		marginVertical: 5,
// 		paddingLeft: 20,
// 		height: 40
// 	},
// 	image: {
// 		height: 200,
// 		width: 200,
// 		marginTop: 50
// 	},
// 	materialUnderlineTextbox1: {
// 		height: 43,
// 		width: 289,
// 	}
// });