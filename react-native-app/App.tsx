import React from 'react';
import config from './aws-exports';
import Amplify from '@aws-amplify/core';
import { NativeInput } from './models/NativeInput';
import AuthWrapper from './views/authWrapper';

Amplify.configure(config);


export default function App(props){
  console.log("*****FIT INITIAL PROPS", props)

  return(
	<AuthWrapper input={props as NativeInput} />
  )
}