import React from 'react';
import { NativeInput } from './models/NativeInput';
import AuthWrapper from './views/authWrapper';


export default function App(props){
  console.log("*****FIT INITIAL PROPS", props)

  return(
	<AuthWrapper input={props as NativeInput} />
  )
}