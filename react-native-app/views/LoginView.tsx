import React, {useContext, useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Platform, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import {authContext} from '../navigation/mainNavigator';
import {check, checkNotifications, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Popup from '../components/Popup';
import ServerFacade from '../backend/ServerFacade';
import User from '../shared/models/User';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function LoginView() {

  const navigation = useNavigation();
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [notiAuthPopupShow, setNotiAuthPopupShow] = useState(false);
  //const [rejectNotis, setRejectNotis] = useState(false);
  const closePopUp = () => {
    setNotiAuthPopupShow(false);
  }
  const handleButton = () => {
    console.log("Pressed");
  }
  
  //Get user from Context from mainNavigator
  const {authUser, setAuthUser} = useContext(authContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS == "ios") {
      console.log("ios");
      checkNotifications().then(({status, settings}) => {
        if (status == RESULTS.BLOCKED) {  //user has rejected notifications
          console.log("BLOCKED");
          setNotiAuthPopupShow(true);
          //setRejectNotis(true);
        }
      });
    }
    
  });

  const signInFunction = async () => {
    if (loading) return;
    setLoading(true);
    
    //If email and password are good, attempt login. Read errors and respond acordingly.
    if (email.length > 4 && password.length > 2) {
      await Auth.signIn(email, password)
        //If we get a user back, setCurrentUser in mainNavigator.
        .then(async (userCognitoData:any) => {
          console.log("USER LOGGED IN: ", userCognitoData.attributes);
          // Use the UserID from Cognito to look up the User in our DB
          let user = await ServerFacade.getUserById(userCognitoData.attributes.sub);
          if (!user) {
            // If the user doesn't exist this is probably the first time they are logging in, so create them.
            user = new User(userCognitoData.attributes.sub,userCognitoData.attributes.email,undefined,undefined,undefined)
            await ServerFacade.createUser(user);
          }

          try {
            await EncryptedStorage.setItem(
              "user_auth", 
              JSON.stringify({
              email : email,
              password : password  
              })
            )
          } catch (error) {
            console.log('Failed to save login: ', error);
          }

          // Setting the user will trigger a navigation to the rest of the app
          setLoading(false)
          setAuthUser(user);
        })
        //Handle the multiple errors
        .catch((err:any) => {
          if (err.code === 'UserNotConfirmedException') {
            console.log('User not confirmed');
            navigation.navigate('confirmation', {
              email,
            });
          }
          else {
            console.log('Could not log in',err);
            Alert.alert("Could not log in", err.message);
          }
          setLoading(false)
        });
    }
    else {
      Alert.alert("", 'Provide an email and password');
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.materialButtonPrimary}>
        { loading ? 
            <ActivityIndicator color="0000ff"size={30} />
          :
            <Button title="Log In" onPress={()=>loading? null : signInFunction()}></Button>
        }
      </View>

      <Popup popupShow={notiAuthPopupShow} hidePopup={closePopUp} handleButton={handleButton}>
        
      </Popup>
      
      <Text style={styles.or2}>--------------- OR ---------------</Text>
      <Text style={styles.loremIpsum} onPress={() => navigation.navigate('signup')}>Don&#39;t have an account? Sign up</Text> 
      <View style={styles.image2Row}>
        <Image
          source={require("../assets/images/image_ia6Y..png")}
          resizeMode="contain"
          style={styles.image2}
        ></Image>
        <Text style={styles.logInWithGoogle}>Log in with Google</Text>
      </View>
      <View style={styles.image3Row}>
        <Image
          source={require("../assets/images/image_S68k..png")}
          resizeMode="contain"
          style={styles.image3}
        ></Image>
        <Text style={styles.logInWithFacebook}>Log in with Facebook</Text>
      </View>
      <View style={styles.image4Row}>
        <Image
          source={require("../assets/images/image_nFko..png")}
          resizeMode="contain"
          style={styles.image4}
        ></Image>
        <Text style={styles.logInWithTwitter}>Log in with Twitter</Text>
      </View>
      <View style={styles.materialUnderlineTextboxStack}>
        <TextInput placeholder="Username" onChangeText={onChangeEmail}></TextInput>
        <TextInput placeholder="Password" secureTextEntry onChangeText={onChangePassword}></TextInput>
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