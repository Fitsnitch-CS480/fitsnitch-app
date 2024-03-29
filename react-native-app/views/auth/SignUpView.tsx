import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput, Keyboard, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import { isEmpty } from 'lodash';
import AuthService from '../../services/AuthService';
import { observer } from 'mobx-react-lite';
import MatButton from '../../components/MatButton';
import MatIcon from '../../components/MatIcon';
import auth from '@react-native-firebase/auth';

const SignUpView = observer(() => {

	const navigation = useNavigation<any>();
	let [email, setEmail] = useState('');
	let [password, setPassword] = useState('');
	let [phoneNumber, setPhoneNumber] = useState('');
	let [firstname, setFirstName] = useState('');
	let [lastname, setLastName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [hideView, setHideView] = useState(true);
	const [phoneNumberError, setPhoneNumberError] = useState('');
	const [firstNameError, setfirstNameError] = useState('');
	const [lastNameError, setlastNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [disableSignUp, setDisableSignUp] = useState(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [hidePassword, setHidePassword] = useState(true);

	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
			setHideView(false)
		});
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
			setHideView(true)
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	const onChangeEmail = (inputEmail: string) => {
		if (isEmpty(inputEmail)) {
			setEmailError('Required');
			setDisableSignUp(true);
		} else {
			setEmail(inputEmail);
			setEmailError('');
			enableSignUpButton();
		}
	}
	const onChangePassword = (inputPassword: string) => {
		if (isEmpty(inputPassword)) {
			setPasswordError('Required');
			setDisableSignUp(true);
		} else {
			setPassword(inputPassword);
			setPasswordError('');
			enableSignUpButton();
		}
	}

	const onChangePhoneNumber = (inputPhoneNumber: any) => {
		if (!inputPhoneNumber.includes("+1")) {
			inputPhoneNumber = "+1".concat(inputPhoneNumber)
		}

		if (inputPhoneNumber.length > 0 && inputPhoneNumber.length < 11) {
			setPhoneNumberError(T.error.invalidPhone);
			if (!disableSignUp) {
				setDisableSignUp(true);
			}
		} else {
			setPhoneNumberError('');
			setPhoneNumber(inputPhoneNumber);
			enableSignUpButton();
		}
	}

	const onChangeFirstName = (inputFirstName: string) => {

		if (isEmpty(inputFirstName)) {
			setfirstNameError('Required');
			setDisableSignUp(true);
		} else {
			setfirstNameError('');
			setFirstName(inputFirstName);
			enableSignUpButton();
		}

		firstname = inputFirstName;
	}

	const onChangeLastName = (inputLastName: string) => {

		if (isEmpty(inputLastName)) {
			setlastNameError('Required');
			setDisableSignUp(true);
		} else {
			setlastNameError('');
			setLastName(inputLastName);
			enableSignUpButton();
		}
	}

	const signUpFunction = async () => {
		setLoading(true);
		if (email.length > 4 && password.length > 2) {
			let newphoneNumber = phoneNumber;
			//may need to take this out of the signUpFunction since it's not doing the change immediatly as the Auth.signUp gets called
			if (!isEmpty(newphoneNumber) && !newphoneNumber.includes("+1")) {
				//onChangePhoneNumber(phoneNumber => "+1".concat(phoneNumber))
				newphoneNumber = "+1".concat(phoneNumber)
			}

			const user: any = {
				email,
				password,
				firstname,
				lastname,
				phoneNumber
			}
			console.log(user)
			try {
				await AuthService.emailSignUp(user);
				navigation.navigate('confirmation', {
					email,
				});
			} catch (err: any) {
				console.log('Could not log in', err);
				setErrorMessage(err.message);
			}
			finally {
				setLoading(false);
			}

		} else {
			setErrorMessage(T.error.provideValidEmailPassword);
		}
	};

	const enableSignUpButton = () => {
		if (!isEmpty(firstname) && !isEmpty(lastname) && !isEmpty(email) && !isEmpty(password) && isEmpty(phoneNumberError)) {
			setDisableSignUp(false);
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

				<View style={styles.materialUnderlineTextboxStack}>
					<TextInput placeholder={T.signUp.firstName} onChangeText={onChangeFirstName} style={styles.textBox}></TextInput>
					{!isEmpty(firstNameError) && <Text style={styles.validation}>{firstNameError}</Text>}
					<TextInput placeholder={T.signUp.lastName} onChangeText={onChangeLastName} style={styles.textBox}></TextInput>
					{!isEmpty(lastNameError) && <Text style={styles.validation}>{lastNameError}</Text>}
					<TextInput placeholder={T.signUp.email} onChangeText={onChangeEmail} style={styles.textBox} ></TextInput>
					{!isEmpty(emailError) && <Text style={styles.validation}>{emailError}</Text>}
					<View style={styles.passwordWrapper}>
						<TextInput
							placeholder={T.signUp.password}
							secureTextEntry={hidePassword}
							onChangeText={onChangePassword}
							style={styles.textBox}
						/>
						<View
							style={styles.passwordLock}
						>
							<TouchableOpacity onPress={()=>setHidePassword(!hidePassword)}>
								<MatIcon size={15} name={hidePassword ? 'lock' : 'lock-open'} />
							</TouchableOpacity>
						</View>
					</View>
					{!isEmpty(passwordError) && <Text style={styles.validation}>{passwordError}</Text>}
					<TextInput placeholder={T.signUp.phoneNumber} keyboardType='numeric' onChangeText={onChangePhoneNumber} style={styles.textBox}></TextInput>
					{!isEmpty(phoneNumberError) && <Text style={styles.validation}>{phoneNumberError}</Text>}
				</View>

				<View>
					<Text style={styles.errorMessage}>{errorMessage}</Text>
				</View>

				<MatButton
					color={Colors.red}
					textColor={Colors.white}
					style={styles.signupButton}
					disabled={disableSignUp}
					onPress={signUpFunction}
				>
					{loading ?
						<ActivityIndicator color={Colors.white} size={30} />
						:
						<Text style={{color: Colors.white}}>{T.signUp.title}</Text>
					}
				</MatButton>

				<View style={styles.textContainer}>
					<Text style={styles.alreadyHaveText}>{T.signUp.alreadyHaveAccount}</Text>
					<Text style={styles.logInText} onPress={() => navigation.navigate('login')}>{T.logIn.title}</Text>
				</View>


			</View>
		</ScrollView>
	);
});

const styles = StyleSheet.create({
	screen: {
		backgroundColor: Colors.background
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		paddingBottom: 20,
	},
	signupButton: {
		borderRadius: 100,
		height: 40,
		width: 275,
		marginVertical: 5,
	},
	textContainer: {
		flex: 2,
		flexDirection: 'row',
		marginTop: 20
	},
	alreadyHaveText: {
		fontFamily: "roboto-regular",
		fontSize: 15,
		color: Colors.white,
		marginRight: 5,
	},
	logInText: {
		fontFamily: "roboto-regular",
		fontSize: 15,
		color: Colors.red,
	},
	signUpOAuthText: {
		fontFamily: "roboto-regular",
		color: Colors.white,
		marginRight: 6,
	},
	materialUnderlineTextboxStack: {
		width: 275,
		flex: 5,
	},
	textBox: {
		backgroundColor: Colors.white,
		color: Colors.charcoal,
		borderRadius: 50,
		marginVertical: 5,
		paddingLeft: 20,
		height: 40
	},
	passwordWrapper: {
		position: 'relative',
	},
	passwordLock: {
		position: 'absolute',
		right: 12,
		top: 17
	},
	image: {
		height: 150,
		width: 150,
		flex: 5,
		marginTop: 20,
		marginBottom: 25
	},
	validation: {
		color: Colors.red,
		flex: 1,
		fontSize: 12,
	},
	errorMessage: {
		color: Colors.red,
	}
});

export default SignUpView;
