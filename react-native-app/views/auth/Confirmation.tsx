import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Auth from '@aws-amplify/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

//Change these to something default, just use these for now for testing
import Button from '../../components/Button';
import Input from '../../components/Input';
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import auth from '@react-native-firebase/auth';

type TProps = {
  route: any;
}


const Confirmation : React.FC<TProps> = ({route}) => {

    const navigation = useNavigation<any>();
    const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState(' ');
  
    const resendConfirmationCode = async () => {
		await auth().currentUser?.sendEmailVerification();
	  }
	
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.buttons}>
          <Button  backgroundColor={Colors.background}>{T.signUp.checkEmail} <Text style={styles.link} onPress={navigation.navigate('login')}>Return to login </Text></Button>
        </View>
        <Text style={styles.error}>{error}</Text>
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
	},
  error: {
    color: Colors.red,
	  marginTop: 5
  },
  link: {
    color: Colors.lightBlue,
	  marginTop: 5
  }
  });
  
  
  export default Confirmation;