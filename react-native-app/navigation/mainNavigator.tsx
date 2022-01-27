import React, {createContext, useEffect, useState} from "react";
import LoginNavigator from "./loginNavigator";
import AppNavigator from "./appNavigator";
import { NavigationContainer } from "@react-navigation/native";
import Auth from '@aws-amplify/auth';
import User from "../shared/models/User";


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
        await loadApp();
      }


    //Hardcoded until we figure out cognito
    let userLoggedIn = 'false';

    // const bootstrap = () => {  
    //     //Instead of this dumb check, do something like amplify.auth().whenAuthStateChanged.... and set the user as whatever comes back.
    //         if(userLoggedIn === 'true'){
    //             setUser("testUser")
    //         }  
    // }
    
    // //This makes it run as a side effect https://dmitripavlutin.com/react-useeffect-explanation/
    // useEffect(() => {
    //     bootstrap()
    // }, [])

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