import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authContext } from '../authWrapper';
import T from '../../assets/constants/text';
import Colors from '../../assets/constants/colors';
import AuthService from '../../services/AuthService';

export default function LoginView() {
	const navigation = useNavigation<any>();
	const [email, onChangeEmail] = useState('');
	const [password, onChangePassword] = useState('');
	const [error, setErrorMessage] = useState('');

	//Get user from Context from mainNavigator
	const { authUser, setAuthUser } = useContext(authContext);
	const [loading, setLoading] = useState<boolean>(false);

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
			catch (err:any) {
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

				<View>
				<Text style={styles.errorMessage}>{error}</Text>
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
					<Text style={styles.signUpText} onPress={() => navigation.navigate('options')}>{T.signUp.title}</Text>
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
	},
	errorMessage: {
		color: Colors.red,
	}
});