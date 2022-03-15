import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginView from "../views/LoginView";
import SignUpView from "../views/SignUpView";
import Confirmation from "../views/Confirmation";
import { NavigationContainer } from '@react-navigation/native';

const stackNavigator = createNativeStackNavigator();

const LoginNavigator : React.FC = () => {
    return(
        <stackNavigator.Navigator>
            <stackNavigator.Screen name="login" component={LoginView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="signup" component={SignUpView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="confirmation" component={Confirmation} options={{headerShown: false,}}/>
        </stackNavigator.Navigator>
    )
}

export default LoginNavigator;