import React, {useContext, useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import {userContext} from '../navigation/mainNavigator';
import {check, checkNotifications, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Popup from '../components/Popup';
import useLocationTracking from '../hooks/useLocationTracking';

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
  const {usertest, setUser} = useContext(userContext);

  useEffect(() => {
    console.log("useEffect....");
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

    //If email and password are good, attempt login. Read errors and respond acordingly.
    if (email.length > 4 && password.length > 2) {
      await Auth.signIn(email, password)
        //If we get a user back, setUser in mainNavigator.
        .then((user) => {
          setUser(user);
        })
        //Handle the multiple errors
        .catch((err) => {
          console.log(':',err);
          if (!err.message) {
            console.log('1 Error when signing in: ', err);
            Alert.alert('Error when signing in: ', err);
          } else {
            if (err.code === 'UserNotConfirmedException') {
              console.log('User not confirmed');
              navigation.navigate('confirmation', {
                email,
              });
            }
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
        <Button title="Log In" onPress={signInFunction}></Button>
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