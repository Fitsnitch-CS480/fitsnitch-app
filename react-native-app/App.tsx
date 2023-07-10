import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from './assets/constants/colors';
import { NativeInput } from './models/NativeInput';
import AuthWrapper from './views/authWrapper';
import { GlobalContextProvider } from './views/GlobalContext';

export default function App(props){
  console.log("*****FIT INITIAL PROPS", props)

  return(
	<SafeAreaView style={{backgroundColor: Colors.background, width: '100%', height: '100%'}}>
		<GlobalContextProvider>
			<AuthWrapper input={props as NativeInput} />
		</GlobalContextProvider>
	</SafeAreaView>
  )
}