import React, {createContext, useEffect, useState} from "react";
import LoginNavigator from "./loginNavigator";
import AppNavigator from "./appNavigator";
import { NavigationContainer } from "@react-navigation/native";
import Auth from '@aws-amplify/auth';
import User, { DeviceTokenType } from "../shared/models/User";
import EncryptedStorage from 'react-native-encrypted-storage';
import ServerFacade from '../backend/ServerFacade';
import { ActivityIndicator, Image, StyleSheet, View, Platform } from "react-native";
import { GetSnitchRequest } from "../shared/models/requests/GetSnitchRequest";
import { CreateSnitchRequest } from "../shared/models/requests/CreateSnitchRequest";
import { LatLonPair } from "../shared/models/CoordinateModels";
import RestaurantData from "../shared/models/RestaurantData";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

// console.log(ActivityIndicator)

export const authContext = createContext<{setAuthUser:(user:User|null)=>void,authUser:User|null}>({authUser:null,setAuthUser:()=>{}});

const MainNavigator : React.FC = () => {
    
  const [loading, setLoading] = useState<boolean>(true);
  const [authUser, setAuthUser] = useState<User|null>(null);
  const [deviceToken, setDeviceToken] = useState<string|null>(null);

    // This method uses Amplify to succesfully resurrect a user session without making
    // them log in again. However, Filipe says he read that it is somehow insecure
    // and not recommended. It's commented out and saved for later

    // const attemptResumeSession = async() => {
    //   console.log("looking for auth user")
    //   try {
    //     let cognitoUser = await Auth.currentAuthenticatedUser()
    //     if (!cognitoUser) return null;
    //     console.log("current authenticated user",cognitoUser.attributes)
    //     let user = await ServerFacade.getUserById(cognitoUser.attributes.sub);   
    //     // Setting the user will trigger a navigation to the rest of the app
    //     if (!user) {
    //       // If the user doesn't exist this is probably the first time they are logging in, so create them.
    //       user = new User(cognitoUser.attributes.sub,cognitoUser.attributes.email,undefined,undefined,undefined)
    //       await ServerFacade.createUser(user);
    //     }
    //     setCurrentUser(user); 
    //     setLoading(false)
    //   }
    //   catch(e) {
    //     console.log("Encountered error while checking for logged in user:", e)
    //     setLoading(false)
    //   }
    // }

    const listenForAPNSToken = () => {
      PushNotificationIOS.requestPermissions();
  
      PushNotificationIOS.checkPermissions(function () {
          console.log("Permissions granted...");
          PushNotificationIOS.addEventListener('register', (token) => {
            setDeviceToken(token);
          })
      });

      PushNotificationIOS.addEventListener('registrationError', (error) => {
        console.log("registrationError...", error)
      });
    }

    const listenForGoogleToken = () => {
      //add in Google logic here

      //setDeviceToken when received
    }

    const addDeviceTokenToUser = (user:User|null, deviceToken:string) => {
      if (user) {
        if (Platform.OS === 'ios') {
          let newDict: {[key: number]: string[]} = {
            0: [deviceToken],
            1: []
          }
          user.associatedDeviceTokens = newDict;
        } else if (Platform.OS === 'android') {
          let newDict: {[key: number]: string[]} = {
            0: [],
            1: [deviceToken]
          }
          user.associatedDeviceTokens = newDict;
        } else {
          throw new Error("Something went wrong adding a user's device token");
        }

        ServerFacade.updateUser(user);
      }
    }

    
    const componentDidMount = async() => {
        // await loadApp();

        listenForAPNSToken();
        listenForGoogleToken();

        try {
          const authentication = await EncryptedStorage.getItem("user_auth");
          // console.log("authentication JSON:", authentication)
          if (authentication){
            let userCognitoData = await Auth.signIn(JSON.parse(authentication).email, JSON.parse(authentication).password)
            //If we get a user back, setCurrentUser in mainNavigator.
            // Use the UserID from Cognito to look up the User in our DB
            let user = await ServerFacade.getUserById(userCognitoData.attributes.sub);   
            if (!user) throw new Error("Could not load user!")

            if (user.associatedDeviceTokens && 
              user.associatedDeviceTokens[DeviceTokenType.APNS].length == 0 && 
              user.associatedDeviceTokens[DeviceTokenType.Google].length == 0 && deviceToken) { //no device tokens ass. with user
                addDeviceTokenToUser(authUser, deviceToken);
            } else if (!user.associatedDeviceTokens && deviceToken) { //update user with device token
              addDeviceTokenToUser(authUser, deviceToken);
            }
            // Setting the user will trigger a navigation to the rest of the app
            setAuthUser(user);
            setLoading(false)
            console.log("Logged in with previous user:", user)
          }
          else {
            console.log("Could not get previous authentication.")
          }
        }
        catch (error) {
          console.log('Failed persistent login: ', error);
        }
        finally {
          setLoading(false)
        }
  }

    useEffect(() => {
        componentDidMount();
        
        return () => {  
          PushNotificationIOS.removeEventListener('register');
          PushNotificationIOS.removeEventListener('registrationError');
        }
    }, [])

    if (loading) {
      return (
        <View style={styles.loadingScreen}>
          
          <Image
            source={require("../assets/images/image_bnui..png")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
          <ActivityIndicator color="#00bbff" size={30} />
        </View>
      )
    }


    //If user is logged in, go to normal app screens. If not, go to the login screens. 
    return(
        <authContext.Provider value={{authUser, setAuthUser}}>
        <NavigationContainer>
            {authUser !== null ? <AppNavigator authUser={authUser} deviceToken={deviceToken} /> : <LoginNavigator deviceToken={deviceToken}/>}
        </NavigationContainer>
        </authContext.Provider>
    )
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center"
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 50
  },
})

export default MainNavigator;