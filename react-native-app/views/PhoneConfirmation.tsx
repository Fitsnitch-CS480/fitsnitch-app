import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Auth from '@aws-amplify/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

//Change these to something default, just use these for now for testing
import Button from '../components/Button';
import Input from '../components/Input';


// TODO
// Navigate to this screen from settings to confirm phone number. 
// Important
// If a user signs up with both a phone number and an email address, and your user pool settings require verification of both attributes, a verification code is sent via SMS to the phone. The email address is not verified, so your app needs to call GetUser to see if an email address is awaiting verification. If it is, the app should call GetUserAttributeVerificationCode to initiate the email verification flow and then submit the verification code by calling VerifyUserAttribute.
// https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html


const PhoneConfirmation : React.FC = ({route}) => {

    const navigation = useNavigation<any>();
    const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState(' ');
    console.log('phone confirmation navigation: ', navigation);
    const email = route.params;

    const confirmSignUp = async () => {
      if (authCode.length > 0) {
        console.log(email.email)
        await Auth.confirmSignUp(email.email, authCode)
          .then(() => {
            navigation.navigate('login');
          })
          .catch((err) => {
            if (!err.message) {
              setError('Something went wrong, please contact support!');
            } else {
              setError(err.message);
            }
          });
      } else {
        setError('You must enter confirmation code');
      }
    };
  
  return (
    <View style={styles.container}>
      <Text>Check your phone for the confirmation code.</Text>
      <Input
        value={authCode}
        placeholder="123456"
        onChange={(text : any) => setAuthCode(text)}
      />
      <Button onPress={() => confirmSignUp()}>Confirm Sign Up</Button>
      <Text>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});


export default PhoneConfirmation;