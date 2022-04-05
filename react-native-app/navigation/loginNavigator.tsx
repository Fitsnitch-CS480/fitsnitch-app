import React, { createContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginView from "../views/LoginView";
import SignUpView from "../views/SignUpView";
import Confirmation from "../views/Confirmation";
import { NavigationContainer } from '@react-navigation/native';

const stackNavigator = createNativeStackNavigator();

type props = {
    deviceToken: string|null
}

export var tokenContext: React.Context<{nativeDeviceToken:string|null}>;

const LoginNavigator : React.FC<props> = ({deviceToken}) => {
    const dCtx = {
        nativeDeviceToken: deviceToken
    }

    tokenContext = createContext(dCtx);

    return(
        <tokenContext.Provider value={dCtx}>

        <stackNavigator.Navigator>
            <stackNavigator.Screen name="login" component={LoginView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="signup" component={SignUpView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="confirmation" component={Confirmation} options={{headerShown: false,}}/>
        </stackNavigator.Navigator>
        
        </tokenContext.Provider>
    )
}

export default LoginNavigator;