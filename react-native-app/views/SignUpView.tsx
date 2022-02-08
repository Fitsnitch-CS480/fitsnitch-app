import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
// import KeyboardAvoidingView from 'react-native'
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import User from '../shared/models/User';
import ServerFacade from '../backend/ServerFacade';


const SignUpView : React.FC = () => {

  const navigation = useNavigation();
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
      //may need to take this out of the signUpFunction since it's not doing the change immediatly as the Auth.signUp gets called
      if (!phoneNumber.includes("+1"))
      {
        onChangePhoneNumber(phoneNumber => "+1".concat(phoneNumber))
        console.log('Phone number is: ', phoneNumber);
      }
      await Auth.signUp({
        username : email,
        password : password,
        attributes: {
          email : email,
          phone_number : phoneNumber,
        }
      })
        .then(async (cognitoSignUp) => {
          console.log('Return from signUp information: ', cognitoSignUp);
          
          // Create User in DynamoDB too
          let user = new User(cognitoSignUp.userSub,cognitoSignUp.user.getUsername(),firstName,lastName,undefined, phoneNumber)
          await ServerFacade.createUser(user);
          
          //Move to confirmation screen, user should get code in email.
          navigation.navigate('confirmation', {
            email
          });
        })
        .catch((err) => {
          console.log(':',err);
          if (!err.message) {
            console.log('1 Error when signing up: ', err);
            Alert.alert('Error when signing up: ', err);
          } else {
            if (err.message) {
              setErrorMessage(err.message);
            }
          }
        });
    } else {
      setErrorMessage('Provide a valid email and password');
      Alert.alert('Error:', errorMessage);
    }
  };

  return (
      

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
      
      

      

      <View style={styles.image}>
        <Image
        source={require("../assets/images/image_bnui..png")}
        resizeMode="contain"
        style={styles.image}
        ></Image>
      </View>
      

      {/* onFocus={() => setHideView(false)} onBlur={() => setHideView(true)} LEAVE THIS AS A COMMENT IN CASE I NEED TO GET BACK TO THIS SOLUTION */}
      <View style={styles.materialUnderlineTextboxStack}>
        <TextInput placeholder="Username" onChangeText={onChangeEmail} ></TextInput>
        <TextInput placeholder="Password" secureTextEntry onChangeText={onChangePassword}></TextInput>
        <TextInput placeholder="Phone Number"  keyboardType='numeric' onChangeText={onChangePhoneNumber}></TextInput>
        <TextInput placeholder="First Name"  onChangeText={onChangeFirstName}></TextInput>
        <TextInput placeholder="Last Name" onChangeText={onChangeLastName}></TextInput>
      </View>

      <View style={styles.materialButtonPrimary}>
        <Button title="Sign Up" onPress={signUpFunction}></Button>
      </View>
      
      {hideView && <Text style={styles.defaultText}>--------------- OR ---------------</Text>}

      {hideView && <View style={styles.signUpRows}>
        <Image
          source={require("../assets/images/image_ia6Y..png")}
          resizeMode="contain"
          style={styles.googleIcon}
        ></Image>
        <Text style={styles.signUpOAuthText}>Sign up with Google</Text>
        {/* <Text style={styles.logInWithGoogle}>Sign up with Google</Text> */}
        
      </View>}

      {hideView && <View style={styles.signUpRows}>
        <Image
          source={require("../assets/images/image_S68k..png")}
          resizeMode="contain"
          style={styles.facebookIcon}
        ></Image>
        {/* <Text style={styles.logInWithFacebook}>Sign up with Facebook</Text> */}
        <Text style={styles.signUpOAuthText}>Sign up with Facebook</Text>
      </View>}

      {hideView && <View style={styles.signUpRows}>
        <Image
          source={require("../assets/images/image_nFko..png")}
          resizeMode="contain"
          style={styles.twitterIcon}
        ></Image>
        <Text style={styles.signUpOAuthText}>Sign up with Twitter</Text>
        {/* <Text style={styles.logInWithTwitter}>Sign up with Twitter</Text> */}
      </View>}
      
      {hideView && <Text style={styles.defaultText} onPress={() => navigation.navigate('login')}>Already have an account? Log In</Text>} 
      
      
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  materialButtonPrimary: {
    // height: 36,
    width: 289,
    paddingTop: 10,
    // marginTop: 388,
    // marginLeft: 52
    flex: 1
  },
  defaultText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: 'center',
    // marginTop: 43,
    // marginLeft: 126
    flex: 1
  },
  signUpOAuthText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    // marginTop: 43,
    marginLeft: 6,
    flex: 1
  },
  googleIcon: {
    height: 33,
    width: 33
  },
  signUpRows: {
    // height: 33,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 180
    // alignItems: 'center',
    
    
    // paddingLeft: 91,
    
    // marginTop: -170,
    // marginLeft: 91,
    // marginRight: 130
  },
  facebookIcon: {
    height: 30,
    width: 30
  },
  twitterIcon: {
    height: 30,
    width: 30
  },
  materialUnderlineTextboxStack: {
    width: 289,
    // height: 43,
    flex: 5
    // marginTop: -359,
    // marginLeft: 52
  },
  image: {
    height: 200,
    width: 200,
    flex: 5,
    // paddingTop: 50
    // marginTop: -243,
    // marginLeft: 79
  }
});

export default SignUpView;
