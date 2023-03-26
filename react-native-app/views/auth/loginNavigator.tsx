import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginView from "./LoginView";
import SignUpView from "./SignUpView";
import EmailVerification from "./EmailVerification";
import VerifyOptions from "./VerifyOptions";
import PhoneVerification from "./PhoneVerification";

const stackNavigator = createNativeStackNavigator();

const LoginNavigator : React.FC = () => {
    return(
        <stackNavigator.Navigator>
            <stackNavigator.Screen name="login" component={LoginView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="signup" component={SignUpView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="options" component={VerifyOptions} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="email" component={EmailVerification} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="phone" component={PhoneVerification} options={{headerShown: false,}}/>
        </stackNavigator.Navigator>
    )
}

export default LoginNavigator;