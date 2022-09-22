import React from 'react';
import MainNavigator from './navigation/mainNavigator';
import config from './aws-exports';
import Amplify from '@aws-amplify/core';
import { NativeInput } from './models/NativeInput';

Amplify.configure(config);


export default function App(props){
  console.log("*****FIT INITIAL PROPS", props)

  return(
    <MainNavigator input={props as NativeInput} />
  )
}