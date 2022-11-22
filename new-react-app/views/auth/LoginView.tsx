import React, {useContext, useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, Image, Alert, TextInput, Platform, ActivityIndicator, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import {Auth} from '@aws-amplify/auth';
import {authContext} from '../authWrapper';
// import {check, checkNotifications, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import Popup from '../components/Popup';
// import ServerFacade from '../backend/ServerFacade';
// import User from '../shared/models/User';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import NativeModuleService from '../backend/services/NativeModuleService';

export default function LoginView() {

  const navigation = useNavigation<any>();
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [notiAuthPopupShow, setNotiAuthPopupShow] = useState(false);
  //const [rejectNotis, setRejectNotis] = useState(false);
  const closePopUp = () => {
    setNotiAuthPopupShow(false);
  }
  
  //Get user from Context from mainNavigator
  const {authUser, setAuthUser} = useContext(authContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // if (Platform.OS == "ios") {
    //   checkNotifications().then(({status, settings}) => {
    //     if (status == RESULTS.BLOCKED) {  //user has rejected notifications
    //       setNotiAuthPopupShow(true);
    //       //setRejectNotis(true);
    //     }
    //   });
    // }
  });

  const signInFunction = async () => {
    if (loading) return;
    setLoading(true);
    
    //If email and password are good, attempt login. Read errors and respond acordingly.
    if (email.length > 4 && password.length > 2) {
    //   await Auth.signIn(email, password)
    //     //If we get a user back, setCurrentUser in mainNavigator.
    //     .then(async (userCognitoData:any) => {
    //       // Use the UserID from Cognito to look up the User in our DB
    //       let user = await ServerFacade.getUserById(userCognitoData.attributes.sub);
    //       if (!user) {
    //         // If the user doesn't exist this is probably the first time they are logging in, so create them.
    //         user = new User(userCognitoData.attributes.sub,userCognitoData.attributes.email,undefined,undefined,undefined)
    //         await ServerFacade.createUser(user);
    //       }

    //       try {
    //         await EncryptedStorage.setItem(
    //           "user_auth", 
    //           JSON.stringify({
    //             email,
    //             password 
    //           })
    //         );
    //         NativeModuleService.getModule().saveUserId(user.userId);
    //       } catch (error) {
    //         console.log('Failed to save login: ', error);
    //       }

    //       // Setting the user will trigger a navigation to the rest of the app
    //       setLoading(false)
    //       setAuthUser(user);
    //     })
    //     //Handle the multiple errors
    //     .catch((err:any) => {
    //       if (err.code === 'UserNotConfirmedException') {
    //         console.log('User not confirmed');
    //         navigation.navigate('confirmation', {
    //           email,
    //         });
    //       }
    //       else {
    //         console.log('Could not log in',err);
    //         Alert.alert("Could not log in", err.message);
    //       }
    //       setLoading(false)
    //     });
    }
    else {
      Alert.alert("", 'Provide an email and password');
      setLoading(false)
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/image_bnui..png")}
        resizeMode="contain"
        style={styles.image}
      />
      
      <View style={styles.materialUnderlineTextboxStack}>
        <TextInput placeholder="Email" onChangeText={onChangeEmail}></TextInput>
        <TextInput placeholder="Password" secureTextEntry onChangeText={onChangePassword}></TextInput>
      </View>

      <View style={styles.materialButtonPrimary}>
        { loading ? 
            <ActivityIndicator color="#00bbff" size={30} />
          :
            <Button title="Log In" onPress={()=>loading? null : signInFunction()}></Button>
        }
      </View>

      <Text style={styles.or2}>--------------- OR ---------------</Text>
      <Text style={styles.loremIpsum} onPress={() => navigation.navigate('signup')}>Don&#39;t have an account? Sign up</Text>      
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
  materialButtonPrimary: {
    height: 36,
    width: 289,
  },
  or2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginVertical: 20
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
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
    marginVertical: 20
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