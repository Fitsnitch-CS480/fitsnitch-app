import React, {createContext, useEffect, useState} from "react";
import LoginNavigator from "./loginNavigator";
import AppNavigator from "./appNavigator";
import { NavigationContainer } from "@react-navigation/native";
import Auth from '@aws-amplify/auth';
import User from "../shared/models/User";
import EncryptedStorage from 'react-native-encrypted-storage';
import ServerFacade from '../backend/ServerFacade';
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { GetSnitchRequest } from "../shared/models/requests/GetSnitchRequest";
import { CreateSnitchRequest } from "../shared/models/requests/CreateSnitchRequest";
import { LatLonPair } from "../shared/models/CoordinateModels";
import RestaurantData from "../shared/models/RestaurantData";



export const userContext = createContext<{setCurrentUser:(user:User)=>void,currentUser:User|null}>({currentUser:null,setCurrentUser:()=>{}});


const MainNavigator : React.FC = () => {
    
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

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


    
    const componentDidMount = async() => {
        // await loadApp();

        //  Run this to test handler on dev server
        // let snitchRequest = new CreateSnitchRequest("testUser1", {name:"name", location:(new LatLonPair(10,10))}, new LatLonPair(10,10) )
        // await ServerFacade.snitchOnUser(snitchRequest);


        console.log("Component mounted")
        try {
          const authentication = await EncryptedStorage.getItem("user_auth");
          // console.log("authentication JSON:", authentication)
          if (authentication){
            let userCognitoData = await Auth.signIn(JSON.parse(authentication).email, JSON.parse(authentication).password)
            //If we get a user back, setCurrentUser in mainNavigator.
            // Use the UserID from Cognito to look up the User in our DB
            let user = await ServerFacade.getUserById(userCognitoData.attributes.sub);   
            // Setting the user will trigger a navigation to the rest of the app
            setCurrentUser(user);
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
    }, [])


    if (loading) {
      return (
        <View style={styles.loadingScreen}>
          
          <Image
            source={require("../assets/images/image_bnui..png")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
          <ActivityIndicator size={30} />
        </View>
      )
    }

    //If user is logged in, go to normal app screens. If not, go to the login screens. 
    return(
        <userContext.Provider value={{currentUser, setCurrentUser}}>
        <NavigationContainer>
            {currentUser !== null ? <AppNavigator /> : <LoginNavigator/>}
        </NavigationContainer>
        </userContext.Provider>
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