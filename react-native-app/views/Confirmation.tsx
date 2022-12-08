import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Auth from '@aws-amplify/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

//Change these to something default, just use these for now for testing
import Button from '../components/Button';
import Input from '../components/Input';
import Colors from '../assets/constants/colors';

type TProps = {
  route: any;
}

const Confirmation : React.FC<TProps> = ({route}) => {

    const navigation = useNavigation<any>();
    const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState(' ');
    const {email} = route.params;

    const confirmSignUp = async () => {
      if (authCode.length > 0) {
        await Auth.confirmSignUp(email, authCode)
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

    const resendConfirmationCode = async () => {
      await Auth.resendSignUp(
        email
      )
    }
  
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Check your email for the confirmation code.</Text>
         <Input
            value={authCode}
            placeholder="123456"
            onChange={(text : any) => setAuthCode(text)}
          />
        <Text style={styles.text}>{error}</Text>
        <View style={styles.buttons}>
          <Button  onPress={() => resendConfirmationCode()}  backgroundColor={'red'}>Resend Code</Button>
          <Button onPress={() => confirmSignUp()} backgroundColor={'black'}>Confirm Sign Up</Button>
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