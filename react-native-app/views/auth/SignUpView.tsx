import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Keyboard, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import User from '../../shared/models/User';
import ServerFacade from '../../services/ServerFacade';
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import {isEmpty} from 'lodash';

const SignUpView : React.FC = () => {

  const navigation = useNavigation<any>();
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [phoneNumber, setPhoneNumber] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hideView, setHideView] = useState(true);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [firstNameError, setfirstNameError] = useState('');
  const [lastNameError, setlastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [disableSignUp, setDisableSignUp] = useState(true);
  


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

  const onChangeEmail =(inputEmail:string) => {
    if(isEmpty(inputEmail)){
      setEmailError('Required');
      setDisableSignUp(true);
    }else{
      setEmail(inputEmail);
      setEmailError('');
      enableSignUpButton();
    }
  }
  const onChangePassword =(inputPassword:string) => {
    if(isEmpty(inputPassword)){
      setPasswordError('Required');
      setDisableSignUp(true);
    } else {
      setPassword(inputPassword);
      setPasswordError('');
      enableSignUpButton();
    }
  }
  
  const onChangePhoneNumber = (inputPhoneNumber:any) => {
    if (!inputPhoneNumber.includes("+1"))
    {
      inputPhoneNumber = "+1".concat(inputPhoneNumber)
    }

    if(inputPhoneNumber.length > 0 && inputPhoneNumber.length < 11){
      setPhoneNumberError(T.error.invalidPhone);
      if(!disableSignUp){
        setDisableSignUp(true);
      }
    } else {
      setPhoneNumberError('');
      setPhoneNumber(inputPhoneNumber);
      enableSignUpButton();
    }
  }

  const onChangeFirstName = (inputFirstName:string) => {

    if(isEmpty(inputFirstName)){
      setfirstNameError('Required');
      setDisableSignUp(true);
    } else {
      setfirstNameError('');
      setFirstName(inputFirstName);
      enableSignUpButton();
    }

    firstName = inputFirstName;
  }

  const onChangeLastName = (inputLastName:string) => {

    if(isEmpty(inputLastName)){
      setlastNameError('Required');
      setDisableSignUp(true);
    } else {
      setlastNameError('');
      setLastName(inputLastName);
      enableSignUpButton();
    }
  }

  const signUpFunction = async () => {
        
    if (email.length > 4 && password.length > 2) {
      let newphoneNumber = phoneNumber;
      //may need to take this out of the signUpFunction since it's not doing the change immediatly as the Auth.signUp gets called
      if (!isEmpty(newphoneNumber) && !newphoneNumber.includes("+1"))
      {
        newphoneNumber = "+1".concat(phoneNumber)
      }

      const data = {
        firstname: firstName,
        lastname: lastName,
				email,
				password,
        phone: newphoneNumber,
        image: ''
			}
			const cognitoUser = await ServerFacade.signUp(data);
			console.log("response from server: ", cognitoUser);
      if(!isEmpty(cognitoUser)){
        navigation.navigate('confirmation', cognitoUser);
      } else {
        throw new Error("Error on sign up. Please try again.");
        
      }
    } else {
      setErrorMessage(T.error.provideValidEmailPassword);
      Alert.alert('Error:', errorMessage);
    }
  };

  const enableSignUpButton = () => {
    if(!isEmpty(firstName) && !isEmpty(lastName) && !isEmpty(email) && !isEmpty(password) && isEmpty(phoneNumberError)){
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
          <TextInput placeholder={T.signUp.password} secureTextEntry onChangeText={onChangePassword} style={styles.textBox}></TextInput>
          {!isEmpty(passwordError) && <Text style={styles.validation}>{passwordError}</Text>}
          <TextInput placeholder={T.signUp.phoneNumber} keyboardType='numeric' onChangeText={onChangePhoneNumber} style={styles.textBox}></TextInput>
          {!isEmpty(phoneNumberError) && <Text style={styles.validation}>{phoneNumberError}</Text>}
        </View>

        <View style={styles.materialButtonPrimary}>
          <Button disabled={disableSignUp} color={Colors.red} title={T.signUp.title} onPress={signUpFunction}></Button>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.alreadyHaveText}>{T.signUp.alreadyHaveAccount}</Text>
          <Text style={styles.logInText} onPress={() => navigation.navigate('login')}>{T.logIn.title}</Text>
        </View>
        
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  screen: {
    backgroundColor: Colors.background
  },
  materialButtonPrimary: {
    width: 289,
    flex: 1,
    marginVertical: 20,
  },
  textContainer: {
    flex: 2,
    flexDirection: 'row'
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
    fontWeight: 'bold',
    color: Colors.red,
  },
  signUpOAuthText: {
    fontFamily: "roboto-regular",
    color: Colors.white,
    marginRight: 6,
  },
  materialUnderlineTextboxStack: {
    width: 289,
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
  image: {
    height: 200,
    width: 200,
    flex: 5,
    marginTop: 20,
    marginBottom: 10
  },
  validation: {
    color: Colors.red, 
    flex: 1,
    fontSize: 12,
  }
});

export default SignUpView;
