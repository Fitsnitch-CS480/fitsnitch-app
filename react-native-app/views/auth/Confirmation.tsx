import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
//Change these to something default, just use these for now for testing
import Button from '../../components/Button';
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import AuthService from '../../services/AuthService';
import {isEmpty} from 'lodash';
import { observer } from 'mobx-react-lite';

type TProps = {
  route: any;
}


const Confirmation = observer<TProps>(({route}) => {

    const navigation = useNavigation<any>();
    const [showRensendLink, setShowResendLink] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('Initial email verification has been sent!');
  
    const resendConfirmationEmail = async () => {
		try{
			await AuthService.resendConfirmationEmail();
		}catch(err:any){
			setErrorMessage(err.message)
		}
		setSuccessMessage("Email verification sent!");
		setShowResendLink(false)
	  }
	
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>{T.confirm.checkEmail}</Text>
        <View style={styles.buttons}>
          <Button onPress={() => navigation.navigate('login')} backgroundColor={Colors.red}>{T.confirm.login}</Button>
        </View>
		{errorMessage ? (
			<Text style={styles.errorMessage}>{errorMessage}</Text>
		): (
			<Text style={styles.successMessage}>{successMessage}</Text>
		)}
		{ showRensendLink && <Text style={styles.link} onPress={() => resendConfirmationEmail()}>{T.confirm.resend}</Text>}
      </View>
	</View>
  );
});


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
	  marginBottom: 15,
	  textAlign: 'center',
	  marginLeft: 15,
	  marginRight: 15,
	},
  error: {
    color: Colors.red,
	  marginTop: 5
  },
  link: {
    color: Colors.lightBlue,
	  marginTop: 5,
	  marginBottom: 5
  },
  errorMessage: {
	marginTop: 5,
	color: Colors.red,
  },
  successMessage: {
	marginTop: 5,
	color: "green",
  },
  });
  
  
  export default Confirmation;