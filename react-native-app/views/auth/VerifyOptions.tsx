import React, { useState } from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
//Change these to something default, just use these for now for testing
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import AuthService from '../../services/AuthService';
import {isEmpty} from 'lodash';

type TProps = {
  route: any;
}


const SendVerification : React.FC<TProps> = ({route}) => {

    const navigation = useNavigation<any>();
    const [showRensendLink, setShowResendLink] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('Initial email verification has been sent!');
  
    const viaEmail = async () => {
		try{
			await AuthService.signUpViaEmail();
		}catch(err:any){
			setErrorMessage(err.message)
		}
		setSuccessMessage("Email verification sent!");
		setShowResendLink(false)
	}

    const viaPhone = async () => {
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
        <Text style={styles.title}>{T.verificationOptions.title}</Text>
        <Text style={styles.subtitle}>{T.verificationOptions.subtitle}</Text>
        <View style={styles.materialButtonPrimary}>				
			<View style={styles.buttons}>				
				<Button color={Colors.red} title={T.verificationOptions.email} onPress={viaEmail}></Button>	
			</View>
			<View style={styles.buttons}>				
				<Button color={Colors.red} title={T.verificationOptions.phone} onPress={viaEmail}></Button>	
			</View>
		</View>
      </View>
	</View>
  );
};


const styles = StyleSheet.create({
	container: {
	  flex: 1,
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
    materialButtonPrimary: {
		height: 72,
		width: 289,
		marginVertical: 10,
	},
	box: {
	  marginTop: 20,
	  alignItems: 'center',
	},
	buttons: {
	  margin: 10,
	},
	title: {
	  color: Colors.white,
	  fontSize: 25,
	  marginBottom: 15,
	  fontWeight: 'bold',
	},
	subtitle: {
	  color: Colors.white,
	  fontSize: 15,
	  marginBottom: 15,
	},
  });
  
  
  export default SendVerification;