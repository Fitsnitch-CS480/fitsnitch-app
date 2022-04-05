import React, {useContext, useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';
// import KeyboardAvoidingView from 'react-native'
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import User from '../shared/models/User';
import ServerFacade from '../backend/ServerFacade';
import { tokenContext } from '../navigation/loginNavigator';


const SignUpView : React.FC = () => {

  const navigation = useNavigation<any>();
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [phoneNumber, onChangePhoneNumber] = useState('');
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hideView, setHideView] = useState(true);
  
  const deviceToken = useContext(tokenContext);

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

  const platformDependantDict = (deviceToken:string|null) => {
    if (deviceToken) {
      if (Platform.OS === 'ios') {
        let newDict: {[key: number]: string[]} = {
          0: [deviceToken],
          1: []
        }
        return newDict
      } else if (Platform.OS === 'android') {
        let newDict: {[key: number]: string[]} = {
          0: [],
          1: [deviceToken]
        }
        return newDict
      } else {
        throw new Error("Something went wrong adding a user's device token");
      }
    } else {
      throw new Error("Something went wrong adding a user's device token");
    }
  }

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

          var user:User;
          if (!deviceToken) {
            user = new User(cognitoSignUp.userSub,cognitoSignUp.user.getUsername(),firstName,lastName,undefined, newphoneNumber, undefined, undefined)
          } else {
            let devTokenDict = platformDependantDict(deviceToken)
            user = new User(cognitoSignUp.userSub,cognitoSignUp.user.getUsername(),firstName,lastName,undefined, newphoneNumber, undefined, devTokenDict)
          }
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
    alignItems: 'center'
  },
  materialButtonPrimary: {
    width: 289,
    paddingTop: 10,
    flex: 1
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
  googleIcon: {
    height: 33,
    width: 33
  },
  signUpRows: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 180
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
    flex: 5
  },
  image: {
    height: 200,
    width: 200,
    flex: 5,
  }
});

export default SignUpView;
