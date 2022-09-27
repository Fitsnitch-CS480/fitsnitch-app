import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
// import KeyboardAvoidingView from 'react-native'
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import User from '../shared/models/User';
import ServerFacade from '../backend/ServerFacade';


const SignUpView : React.FC = () => {

  const navigation = useNavigation<any>();
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [phoneNumber, onChangePhoneNumber] = useState('');
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hideView, setHideView] = useState(true);
  


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

  const signUpFunction = async () => {
        
    if (email.length > 4 && password.length > 2) {
      let newphoneNumber = ""
      //may need to take this out of the signUpFunction since it's not doing the change immediatly as the Auth.signUp gets called
      if (!phoneNumber.includes("+1"))
      {
        //onChangePhoneNumber(phoneNumber => "+1".concat(phoneNumber))
        newphoneNumber = "+1".concat(phoneNumber)
      }
      
      await Auth.signUp({
        username : email,
        password : password,
        attributes: {
          email : email,
          phone_number : newphoneNumber,
        }
      })
        .then(async (cognitoSignUp) => {
          console.log('Return from signUp information: ', cognitoSignUp);
          
          // Create User in DynamoDB too
          let user = new User(cognitoSignUp.userSub,cognitoSignUp.user.getUsername(),firstName,lastName,undefined, newphoneNumber)
          await ServerFacade.createUser(user);
          
          //Move to confirmation screen, user should get code in email.
          navigation.navigate('confirmation', {
            email
          });
        })
        .catch((err) => {
          console.log('Error when signing up: ', err);
          Alert.alert("Please Try Again", err.message || err);
        });
    } else {
      setErrorMessage('Provide a valid email and password');
      Alert.alert('Error:', errorMessage);
    }
  };

  return (
      <ScrollView>
      <View style={styles.container}>

      <View style={styles.image}>
        <Image
          source={require("../assets/images/image_bnui..png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
      

      {/* TODO add validation and requirements for all fields!
          Phone number field accepts '2082' which it should not
          First and Last name need to be required
      */}
      <View style={styles.materialUnderlineTextboxStack}>
        <TextInput placeholder="Email" onChangeText={onChangeEmail} ></TextInput>
        <TextInput placeholder="Password" secureTextEntry onChangeText={onChangePassword}></TextInput>
        <TextInput placeholder="Phone Number"  keyboardType='numeric' onChangeText={onChangePhoneNumber}></TextInput>
        <TextInput placeholder="First Name"  onChangeText={onChangeFirstName}></TextInput>
        <TextInput placeholder="Last Name" onChangeText={onChangeLastName}></TextInput>
      </View>

      <View style={styles.materialButtonPrimary}>
        <Button title="Sign Up" onPress={signUpFunction}></Button>
      </View>
      
        
      {<Text style={styles.defaultText} onPress={() => navigation.navigate('login')}>Already have an account? Log In</Text>} 
      
      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  materialButtonPrimary: {
    width: 289,
    paddingTop: 10,
    flex: 1,
    marginVertical: 20
  },
  defaultText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: 'center',
    flex: 1
  },
  signUpOAuthText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 6,
    flex: 1
  },
  materialUnderlineTextboxStack: {
    width: 289,
    flex: 5
  },
  image: {
    height: 200,
    width: 200,
    flex: 5,
    marginTop: 20
  }
});

export default SignUpView;
