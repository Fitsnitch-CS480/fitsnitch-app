import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeInput } from './models/NativeInput';
import AuthWrapper from './views/authWrapper';

export default function App(props){
  console.log("*****FIT INITIAL PROPS", props)

  return(
	<SafeAreaView style={{backgroundColor: 'black', width: '100%', height: '100%'}}>
		<AuthWrapper input={props as NativeInput} />
	</SafeAreaView>
  )
}