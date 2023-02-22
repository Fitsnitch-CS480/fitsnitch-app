import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
//Change these to something default, just use these for now for testing
import Button from '../../components/Button';
import Input from '../../components/Input';
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import ServerFacade from '../../services/ServerFacade';
import { isEmpty } from '@aws-amplify/core';

type TProps = {
  route: any;
}


const Confirmation : React.FC<TProps> = ({route}) => {

    const navigation = useNavigation<any>();
    const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState(' ');
    const cognitoUser = route.params;

    const confirmSignUp = async () => {
      if (authCode.length > 0) {
        // create serverfacade function in backend to make confirmation. 
        const data = {user: cognitoUser, authCode: authCode}
        const response = await ServerFacade.confirmation(data);
        if(isEmpty(response)){
          setError("Invalid code, please try again.");
        }
        else {
          navigation.navigate('login', route.params);
        }
      } else {
        setError('You must enter confirmation code');
      }
    };
  
    const resendConfirmationCode = async () => {
      await ServerFacade.confirmation(cognitoUser); 
	  }
	
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>{T.signUp.checkEmail}</Text>
         <Input
            value={authCode}
            placeholder="123456"
            onChange={(text : any) => setAuthCode(text)}
          />
        <Text style={styles.text}>{error}</Text>
        <View style={styles.buttons}>
          <Button  onPress={() => resendConfirmationCode()}  backgroundColor={Colors.red}>Resend Code</Button>
          <Button onPress={() => confirmSignUp()} backgroundColor={Colors.background}>{T.signUp.confirm}</Button>
        </View>
      </View>
	</View>
  );
};


const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: 'center',
	  backgroundColor: Colors.background,
	  shadowColor: '#000',
	  shadowOffset: {
		width: 0,
		height: 2,
	  },
	  shadowOpacity: 0.25,
	  shadowRadius: 3.84,
	  elevation: 5,
	},
	box: {
	  alignItems: 'center',
	  justifyContent: 'flex-start',
	},
	buttons: {
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	},
	text: {
	  color: Colors.white,
	  marginBottom: 5
	}
  });
  
  
  export default Confirmation;