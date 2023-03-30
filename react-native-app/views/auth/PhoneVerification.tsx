import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/Input';
//Change these to something default, just use these for now for testing
import Button from '../../components/Button';
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import AuthService from '../../services/AuthService';
import {isEmpty} from 'lodash';

type TProps = {
  route: any;
}

const PhoneVerification : React.FC<TProps> = ({route}) => {

    const navigation = useNavigation<any>();
    const [sendCode, setSendCode] = useState(true);
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const [showRensendLink, setShowResendLink] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('Initial email verification has been sent!');
    const user = route.params.user;
  
    if(sendCode){
        try{
          const confirmation:any = AuthService.signUpViaPhone(user);
          console.log({confirmation});
          setConfirm(confirmation);
          setSendCode(false);
        }catch(error){
          console.log(error);
          // setErrorMessage("Error");
        }
    }
    const confirmSignUp = async () => {
      try {
          //@ts-ignore
        await confirm.confirm(code);
      } catch (error) {
        console.log('Invalid code.');
        setErrorMessage('Invalid code.');
      }
    }

    const resendVerificationCode = async () => {
      console.log("phone verification user: ", user)
      try {
          //@ts-ignore
        await AuthService.resendVerificationCode(user.phoneNumber);
      } catch (error) {
        console.log('Invalid code.');
        setErrorMessage('Unable to resend code.');
      }
    }
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>{T.signUp.phoneConfirmation}</Text>
         <Input
            value={code}
            placeholder="123456"
            onChange={(text : any) => setCode(text)}
          />
        {errorMessage && (<Text style={styles.error}>{errorMessage}</Text>)}
        <View style={styles.buttons}>
          <Button  onPress={() => resendVerificationCode()}  backgroundColor={Colors.red}>Resend Code</Button>
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
	  marginBottom: 15,
	  textAlign: 'center',
	  marginLeft: 15,
	  marginRight: 15,
	},
	error: {
		color: Colors.red,
		marginBottom: 10,
    fontWeight: 'bold'
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
  
  
  export default PhoneVerification;