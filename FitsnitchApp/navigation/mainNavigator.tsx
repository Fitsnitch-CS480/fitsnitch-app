import React, {useEffect, useState} from "react";
import LoginNavigator from "./loginNavigator";
import AppNavigator from "./appNavigator";
import { NavigationContainer } from "@react-navigation/native";

const MainNavigator : React.FC = () => {
    
    const [user, setUser] = useState<any>(null);
    
    //Hardcoded until we figure out cognito
    let userLoggedIn = 'true';

    const bootstrap = () => {
            //Instead of this dumb check, do something like amplify.auth().whenAuthStateChanged.... and set the user as whatever comes back.
            if(userLoggedIn === 'true'){
                setUser("testUser")
            }  
    }
    
    //This makes it run as a side effect https://dmitripavlutin.com/react-useeffect-explanation/
    useEffect(() => {
        bootstrap()
    }, [])

    //If user is logged in, go to normal app screens. If not, go to the login screens. 
    return(
        <NavigationContainer>
            {user !== null ? <AppNavigator /> : <LoginNavigator />}
        </NavigationContainer>
    )
}

export default MainNavigator;