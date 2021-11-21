import React from 'react';
import { Button, StyleSheet, Text, View, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SignUpView from './SignUpView';
import { Screen } from 'react-native-screens';
import MaterialButtonPrimary from "../components/MaterialButtonPrimary";
import MaterialUnderlineTextbox from "../components/MaterialUnderlineTextbox";
import { TextInput } from 'react-native-gesture-handler';
import { placeholder } from '@babel/types';
import AppNavigator from '../navigation/appNavigator';

const LoginView : React.FC = () => {

  const navigation = useNavigation();
  return (
    // <View>
    //   <Text>
    //     Hello this is Login Screenss
    //   </Text>
    //   <Button title="Login" onPress={() => navigation.navigate('signup')} />
    // </View>
    <View style={styles.container}>
      
      <View style={styles.materialButtonPrimary}>
        <MaterialButtonPrimary
        //style={styles.materialButtonPrimary} 
        //onPress={() => navigation.navigate('signup')}
        text="Log In"
      ></MaterialButtonPrimary>
      </View>
      
      <Text style={styles.or2}>--------------- OR ---------------</Text>
      <Text style={styles.loremIpsum} onPress={() => navigation.navigate('signup')}>Don&#39;t have an account? Sign up</Text> 
      <View style={styles.image2Row}>
        <Image
          source={require("../assets/images/image_ia6Y..png")}
          resizeMode="contain"
          style={styles.image2}
        ></Image>
        <Text style={styles.logInWithGoogle}>Log in with Google</Text>
      </View>
      <View style={styles.image3Row}>
        <Image
          source={require("../assets/images/image_S68k..png")}
          resizeMode="contain"
          style={styles.image3}
        ></Image>
        <Text style={styles.logInWithFacebook}>Log in with Facebook</Text>
      </View>
      <View style={styles.image4Row}>
        <Image
          source={require("../assets/images/image_nFko..png")}
          resizeMode="contain"
          style={styles.image4}
        ></Image>
        <Text style={styles.logInWithTwitter}>Log in with Twitter</Text>
      </View>
      <View style={styles.materialUnderlineTextboxStack}>
        <MaterialUnderlineTextbox
          // style={styles.materialUnderlineTextbox}
          placeholder="Username"
        ></MaterialUnderlineTextbox>
        <MaterialUnderlineTextbox
        // style={styles.materialUnderlineTextbox1}
        placeholder="Password"
        secureTextEntry
      ></MaterialUnderlineTextbox>
      </View>
      <Image
        source={require("../assets/images/image_bnui..png")}
        resizeMode="contain"
        style={styles.image}
      ></Image>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  materialButtonPrimary: {
    height: 36,
    width: 289,
    marginTop: 388,
    marginLeft: 52
  },
  or2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 43,
    marginLeft: 126
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 201,
    marginLeft: 91
  },
  image2: {
    height: 33,
    width: 33
  },
  logInWithGoogle: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 6,
    marginTop: 8
  },
  image2Row: {
    height: 33,
    flexDirection: "row",
    marginTop: -170,
    marginLeft: 91,
    marginRight: 130
  },
  image3: {
    height: 27,
    width: 27
  },
  logInWithFacebook: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 9,
    marginTop: 5
  },
  image3Row: {
    height: 27,
    flexDirection: "row",
    marginTop: 1,
    marginLeft: 94,
    marginRight: 113
  },
  image4: {
    height: 30,
    width: 30
  },
  logInWithTwitter: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 7,
    marginTop: 6
  },
  image4Row: {
    height: 30,
    flexDirection: "row",
    marginLeft: 93,
    marginRight: 132
  },
  materialUnderlineTextbox: {
    height: 43,
    width: 289,
    position: "absolute",
    left: 0,
    top: 0,
    placeholder: "Sign up"
  },
  materialUnderlineTextboxStack: {
    width: 289,
    height: 43,
    marginTop: -359,
    marginLeft: 52
  },
  image: {
    height: 200,
    width: 200,
    marginTop: -243,
    marginLeft: 79
  },
  materialUnderlineTextbox1: {
    height: 43,
    width: 289,
    marginTop: 57,
    marginLeft: 52
  }
});

export default LoginView;
