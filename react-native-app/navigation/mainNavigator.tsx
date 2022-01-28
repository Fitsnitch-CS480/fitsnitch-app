import React, {createContext, useEffect, useState} from "react";
import LoginNavigator from "./loginNavigator";
import AppNavigator from "./appNavigator";
import { NavigationContainer } from "@react-navigation/native";
import Auth from '@aws-amplify/auth';
import User from "../shared/models/User";
import EncryptedStorage from 'react-native-encrypted-storage';
import ServerFacade from '../backend/ServerFacade';

export const userContext = createContext<{setCurrentUser:(user:User)=>void,currentUser:User|null}>({currentUser:null,setCurrentUser:()=>{}});


const MainNavigator : React.FC = () => {
    
    const [currentUser, setCurrentUser] = useState<any>(null);

    

    const signOut = async() => {
        await Auth.signOut()
          .catch((err) => {
            console.log('ERROR: ', err);
          });
        setCurrentUser(null);
      }
    
      const signIn = async(_user: any) => {
        //setUser(_user.signInUserSession.accessToken.jwtToken);
        setCurrentUser(_user);
        console.log("this went in");
        
      }

    const loadApp = async() => {
        await Auth.currentAuthenticatedUser()
          .then((user) => {
            signIn(user);
          })
          .catch(() => {
            console.log('err signing in');
          });
      }

    const componentDidMount = async() => {
        // await loadApp();
        console.log("Component mounted")
        try {
          const authentication = await EncryptedStorage.getItem("user_auth");
          // console.log("authentication JSON:", authentication)
          if (authentication !== undefined){
            await Auth.signIn(JSON.parse(authentication).email, JSON.parse(authentication).password)
            //If we get a user back, setCurrentUser in mainNavigator.
            .then(async (userCognitoData) => {
              // Use the UserID from Cognito to look up the User in our DB
              let user = await ServerFacade.getUserById(userCognitoData.attributes.sub);   
              // Setting the user will trigger a navigation to the rest of the app
              setCurrentUser(user);
            })
            //Handle the multiple errors
            .catch((err) => {
              console.log(':',err);
              if (!err.message) {
                console.log('1 Error when signing in: ', err);
              }
            });
          }
        } catch (error) {
          console.log('Failed persistent login: ', error);
        }
      }


    //Hardcoded until we figure out cognito
    // let userLoggedIn = 'false';

    // const bootstrap = () => {  
    //     //Instead of this dumb check, do something like amplify.auth().whenAuthStateChanged.... and set the user as whatever comes back.
    //         if(userLoggedIn === 'true'){
    //             setUser("testUser")
    //         }  
    // }
    
    // //This makes it run as a side effect https://dmitripavlutin.com/react-useeffect-explanation/
    useEffect(() => {
        componentDidMount();
    }, [])

    //If user is logged in, go to normal app screens. If not, go to the login screens. 
    return(
        <userContext.Provider value={{currentUser, setCurrentUser}}>
        <NavigationContainer>
            {currentUser !== null ? <AppNavigator /> : <LoginNavigator/>}
        </NavigationContainer>
        </userContext.Provider>
    )
}


export default MainNavigator;