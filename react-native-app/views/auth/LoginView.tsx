import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import T from '../../assets/constants/text';
import Colors from '../../assets/constants/colors';
import AuthService from '../../services/AuthService';
import { isEmpty } from "lodash";
import { observer } from 'mobx-react-lite';
import { globalContext } from '../GlobalContext';
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

const LoginView = observer(() => {
	const { setCurrentUser } = useContext(globalContext);
	const [email, onChangeEmail] = useState('');
	const [password, onChangePassword] = useState('');
	const [error, setErrorMessage] = useState('');
	const [showBetaModal, setShowBetaModal] = useState(false);

	//Get user from Context from mainNavigator
	const [loading, setLoading] = useState<boolean>(false);

	// Currently unused
	const signInFunction = async () => {
		if (loading) return;
		setLoading(true);

		//If email and password are good, attempt login. Read errors and respond accordingly.
		if (email.length > 4 && password.length > 2) {
			try {
				let user = await AuthService.attemptLogin(email, password);
				// Setting the user will trigger a navigation to the rest of the app
				setLoading(false);
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
		setErrorMessage('');
		setLoading(true);
		try {
			const user: any = await AuthService.googleSignIn();
			if (user) {
				setCurrentUser(user);
			}
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			console.log(error)
			setErrorMessage("Could not sign in with Google");
		}
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.betaWarning}
				onPress={() => setShowBetaModal(true)}
			>
				<Text style={{ color: Colors.white, textAlign: 'center' }}>This app is in Beta. Tap to learn more.</Text>
			</TouchableOpacity>
			<View style={styles.loginArea}>
				<Image
					source={require("../../assets/images/main_logo.png")}
					resizeMode="contain"
					style={styles.image}
				/>

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
				</View>

				{loading &&
					<ActivityIndicator color={Colors.red} size={30} />
				}

				<View>
					<Text style={styles.errorMessage}>{error}</Text>
				</View>
			</View>

			<Text style={styles.policies}>
				By signing in, you agree to our&nbsp;
				<Text style={styles.link} onPress={() => Linking.openURL('https://fitsnitch.com/privacy')}>Privacy Policy</Text>
				&nbsp;and&nbsp;
				<Text style={styles.link} onPress={() => Linking.openURL('https://fitsnitch.com/privacy')}>Terms of Use</Text>
			</Text>


			<Modal
				visible={showBetaModal}
				onRequestClose={() => setShowBetaModal(false)}
				animationType="slide"
				transparent
			>
				<View style={styles.modalArea}>
					<View style={styles.modalBox}>
						<Text style={styles.h3}>Thank you for supporting FitSnitch!</Text>
						<Text style={styles.p}>While the app is in Beta, you may experience unexpected changes or data loss.</Text>
						<Text style={styles.p}>Please contact fitsnitchdev@gmail.com with any questions.</Text>
					</View>
				</View>
			</Modal>
		</View >
	);
});

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: Colors.background
	},
	betaWarning: {
		backgroundColor: Colors.red,
		padding: 10
	},
	modalArea: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalBox: {
		width: 400,
		maxWidth: '80%',
		padding: 20,
		margin: 'auto',
		backgroundColor: Colors.lightGrey,
		shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 2,
		borderRadius: 10
	},
	h3: {
		fontSize: 20,
		color: 'white',
	},
	p: {
		fontSize: 14,
		color: 'white',
		marginTop: 15
	},
	loginArea: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexGrow: 1,
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
	image: {
		height: 200,
		width: 200,
		marginTop: 50,
		marginBottom: 25,
	},
	errorMessage: {
		color: Colors.red,
	},
	policies: {
		color: 'white',
		textAlign: 'center',
		width: '80%',
		alignSelf: 'center',
		marginBottom: 50
	},
	link: {
		color: Colors.red,
	}
});

export default LoginView;