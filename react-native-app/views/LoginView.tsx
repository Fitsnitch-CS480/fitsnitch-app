import React, {useContext, useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Platform, ActivityIndicator, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Auth} from '@aws-amplify/auth';
import {authContext} from '../navigation/mainNavigator';
import {checkNotifications, RESULTS} from 'react-native-permissions';
import ServerFacade from '../backend/ServerFacade';
import User from '../shared/models/User';
import EncryptedStorage from 'react-native-encrypted-storage';
import NativeModuleService from '../backend/services/NativeModuleService';
import T from '../assets/constants/text';
import Colors from '../assets/constants/colors';

export default function LoginView() {

  const navigation = useNavigation<any>();
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const [notiAuthPopupShow, setNotiAuthPopupShow] = useState(false);
  //const [rejectNotis, setRejectNotis] = useState(false);
  const closePopUp = () => {
    setNotiAuthPopupShow(false);
  }
  
  //Get user from Context from mainNavigator
  const {authUser, setAuthUser} = useContext(authContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS == "ios") {
      checkNotifications().then(({status, settings}) => {
        if (status == RESULTS.BLOCKED) {  //user has rejected notifications
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
                email,
                password 
              })
            );
            NativeModuleService.getModule().saveUserId(user.userId);
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
            Alert.alert(T.error.noLogIn, err.message);
          }
          setLoading(false)
        });
    }
    else {
      Alert.alert("", T.error.provideEmailPassword);
      setLoading(false)
    }
  };

  return (
    <ScrollView style={styles.screen}>
    <View style={styles.container}>
      <Image
        source={require("../assets/images/main_logo.png")}
        resizeMode="contain"
        style={styles.image}
      />
      
      <View style={styles.materialUnderlineTextboxStack}>
        <TextInput placeholder={T.signUp.email} onChangeText={onChangeEmail} style={styles.textBox}></TextInput>
        <TextInput placeholder={T.signUp.password} secureTextEntry onChangeText={onChangePassword} style={styles.textBox}></TextInput>
      </View>

      <View style={styles.materialButtonPrimary}>
        { loading ? 
            <ActivityIndicator color={Colors.lightBlue} size={30} />
          :
            <Button color={Colors.red} title={T.logIn.title} onPress={()=>loading? null : signInFunction()}></Button>
        }
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.dontHaveAccount}>{T.logIn.dontHaveAccount}</Text>      
        <Text style={styles.signUpText} onPress={() => navigation.navigate('signup')}>{T.signUp.title}</Text>
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
  }
});