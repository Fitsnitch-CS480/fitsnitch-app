import React, {useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import User from '../shared/models/User';
import ServerFacade from '../backend/ServerFacade';


const SignUpView : React.FC = () => {

  const navigation = useNavigation();
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [phoneNumber, onChangePhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  

  const signUpFunction = async () => {
        
    if (email.length > 4 && password.length > 2) {
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
          let user = new User(cognitoSignUp.userSub,cognitoSignUp.user.getUsername(),undefined,undefined,undefined, phoneNumber)
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
      <View style={styles.container}>
      
      <View style={styles.materialButtonPrimary}>
        <Button title="Sign Up" onPress={signUpFunction}></Button>
      </View>
      
      <Text style={styles.or2}>--------------- OR ---------------</Text>
      <Text style={styles.loremIpsum} onPress={() => navigation.navigate('login')}>Already have an account? Log In</Text> 
      <View style={styles.image2Row}>
        <Image
          source={require("../assets/images/image_ia6Y..png")}
          resizeMode="contain"
          style={styles.image2}
        ></Image>
        <Text style={styles.logInWithGoogle}>Sign up with Google</Text>
      </View>
      <View style={styles.image3Row}>
        <Image
          source={require("../assets/images/image_S68k..png")}
          resizeMode="contain"
          style={styles.image3}
        ></Image>
        <Text style={styles.logInWithFacebook}>Sign up with Facebook</Text>
      </View>
      <View style={styles.image4Row}>
        <Image
          source={require("../assets/images/image_nFko..png")}
          resizeMode="contain"
          style={styles.image4}
        ></Image>
        <Text style={styles.logInWithTwitter}>Sign up with Twitter</Text>
      </View>
      <View style={styles.materialUnderlineTextboxStack}>
        <TextInput placeholder="Username" onChangeText={onChangeEmail}></TextInput>
        <TextInput placeholder="Password" secureTextEntry onChangeText={onChangePassword}></TextInput>
        <TextInput placeholder="Phone Number" keyboardType='numeric' onChangeText={onChangePhoneNumber}></TextInput>
      </View>
      <Image
        source={require("../assets/images/image_bnui..png")}
        resizeMode="contain"
        style={styles.image}
      ></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  materialButtonPrimary: {
    height: 36,
    width: 289,
    marginTop: 388,
    marginLeft: 52
  },
  or2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 43,
    marginLeft: 126
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 201,
    marginLeft: 91
  },
  image2: {
    height: 33,
    width: 33
  },
  logInWithGoogle: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 6,
    marginTop: 8
  },
  image2Row: {
    height: 33,
    flexDirection: "row",
    marginTop: -170,
    marginLeft: 91,
    marginRight: 130
  },
  image3: {
    height: 27,
    width: 27
  },
  logInWithFacebook: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 9,
    marginTop: 5
  },
  image3Row: {
    height: 27,
    flexDirection: "row",
    marginTop: 1,
    marginLeft: 94,
    marginRight: 113
  },
  image4: {
    height: 30,
    width: 30
  },
  logInWithTwitter: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 7,
    marginTop: 6
  },
  image4Row: {
    height: 30,
    flexDirection: "row",
    marginLeft: 93,
    marginRight: 132
  },
  materialUnderlineTextbox: {
    height: 43,
    width: 289,
    position: "absolute",
    left: 0,
    top: 0,
    placeholder: "Sign up"
  },
  materialUnderlineTextboxStack: {
    width: 289,
    height: 43,
    marginTop: -359,
    marginLeft: 52
  },
  image: {
    height: 200,
    width: 200,
    marginTop: -243,
    marginLeft: 79
  },
  materialUnderlineTextbox1: {
    height: 43,
    width: 289,
    marginTop: 57,
    marginLeft: 52
  }
});

export default SignUpView;
