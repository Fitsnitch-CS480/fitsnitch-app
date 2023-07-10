import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginView from "./LoginView";
import SignUpView from "./SignUpView";
import Confirmation from "./Confirmation";
import { observer } from "mobx-react-lite";

const stackNavigator = createNativeStackNavigator();

const LoginNavigator = observer(() => {
    return(
        <stackNavigator.Navigator>
            <stackNavigator.Screen name="login" component={LoginView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="signup" component={SignUpView} options={{headerShown: false,}}/>
            <stackNavigator.Screen name="confirmation" component={Confirmation} options={{headerShown: false,}}/>
        </stackNavigator.Navigator>
    )
})

export default LoginNavigator;