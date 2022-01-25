import React from 'react';
import { StyleSheet, View, Button, Text, Alert } from 'react-native';
import ServerFacade from '../backend/ServerFacade';
import axios from 'axios';


function SnitchPopUp(props: any) {

  let doNothing = async () => {
    props.setTrigger(false);
    Alert.alert("Great Decision! Remember your goals!");
  }

  let useCheat = async () => {
    props.setTrigger(false);
    Alert.alert("Checking if you have cheats available. Otherwise you will be snitched on!");
  }
  
  return (props.trigger) ? (
   <View style={styles.container}>
     <View>
     {props.children}
     </View>
     <View style={styles.buttonContainer}>
        <Button title="I'll Leave"  color='black' onPress={doNothing}>Snitch</Button>
      <Text></Text>
        <Button title="Use A Cheat" color='black' onPress={useCheat}>Cheat Meal</Button>
    </View>
    <Text style={styles.errorText}>Report an error</Text>
   </View>
 ): null;
}

const styles = StyleSheet.create({
  container: {
    height: "65%",
    backgroundColor: "white",
    borderColor: 'black',
    borderWidth: 2,
    marginTop: 100
  },
  buttonContainer: {
    // flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'blue'
  },
  errorText: {
    fontSize: 10,
    alignSelf: "center",
    textDecorationLine: 'underline'
  }
});

export default SnitchPopUp;