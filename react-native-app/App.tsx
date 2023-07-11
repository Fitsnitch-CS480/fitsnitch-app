import React from 'react';
import { Text } from 'react-native';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from './assets/constants/colors';
import { NativeInput } from './models/NativeInput';
import AuthWrapper from './views/authWrapper';
import { GlobalContextProvider } from './views/GlobalContext';

const mode = Config.MODE;

export default function App(props){
  console.log("*****FIT INITIAL PROPS", props)

  return(
	<SafeAreaView style={{backgroundColor: Colors.background, width: '100%', height: '100%'}}>
		<GlobalContextProvider>
			{ (!['beta', 'production'].includes(mode || '')) &&
				<Text
					style={{
						backgroundColor: Colors.lightGrey,
						color: Colors.white,
						padding: 8,
						textAlign: 'center',
						width: '100%',
						fontSize: 12
					}}
				>
					Mode: {mode}
				</Text> }
			<AuthWrapper input={props as NativeInput} />
		</GlobalContextProvider>
	</SafeAreaView>
  )
}