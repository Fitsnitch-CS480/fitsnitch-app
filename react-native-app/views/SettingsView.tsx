import React, {useContext} from 'react';
import {authContext} from '../navigation/mainNavigator';
import {Auth} from '@aws-amplify/auth';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { globalContext } from '../navigation/appNavigator';
import { observer } from 'mobx-react-lite';
import { LatLonPair } from '../shared/models/CoordinateModels';
import NativeModuleService from '../backend/services/NativeModuleService';
import T from '../assets/constants/text';
import Colors from '../assets/constants/colors';

const SettingsView = observer(({navigation}:any) => {
  //Get user from Context from mainNavigator
  const {authUser, setAuthUser} = useContext(authContext);
  const {logStore} = useContext(globalContext);

  let logout = async () => {
    await Auth.signOut()
    .then(async () => {
      setAuthUser(null);
      try {
        await EncryptedStorage.removeItem("user_auth");
        NativeModuleService.getModule().stopBackgroundLocation();
      } catch (error) {
        console.log(':',error);
      }
    })
    .catch((err) => {
      console.log(':',err);
      if (!err.message) {
        console.log('1 Error when signing out: ', err);
      }
    });
  }

  const promptLogout = () => {
    Alert.alert(T.settings.logoutPrompt, undefined, [
      { text: T.settings.cancel },
      { text: T.settings.logout, onPress: logout },
    ]);
  }
  
  function demoSnitch() {
    navigation.navigate('GetSnitchedOn', { 
      restaurant: {
        name: "Domino's"
      },
      coords: new LatLonPair(-41,-111)
    })
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.listItem}>
        <Text style={styles.optionTitle}>{T.settings.debug}</Text>
        <Switch 
          value={logStore.visible} 
          onValueChange={()=>logStore.setVisibility(!logStore.visible)}
          thumbColor={Colors.red} 
          trackColor={{ true: Colors.darkRed, false: Colors.white }} />
      </View>

      {/* <View style={styles.listItem} onTouchEnd={demoSnitch}>
        <Text style={styles.optionTitle}>Run Demo Snitch</Text>
      </View> */}

      <View style={styles.listItem} onTouchEnd={promptLogout}>
        <Text style={styles.optionTitle}>{T.settings.logout}</Text>
      </View>

    </ScrollView>
  );
});

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.background
  },
  listItem: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: Colors.background,
    backgroundColor: Colors.lightBackground,
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionTitle: {
    fontSize: 16,
    flexGrow: 1,
    color: Colors.white
  }
});

export default SettingsView;