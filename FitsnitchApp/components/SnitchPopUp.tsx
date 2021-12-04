import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import ServerFacade from '../backend/ServerFacade';
import axios from 'axios';


function SnitchPopUp(props: any) {

  const sendSnitch = async () =>
    {
      //send hard code coordinates to api endpoint
      if(await ServerFacade.checkLocation()){
        //send text or notification to trainer/accountability partner
      }
      else{
        //display message saying, user wont be snitch ?
      }
    }
  
  return (props.trigger) ? (
   <View style={styles.container}>
     <View>
     {props.children}
     </View>
     <View style={styles.buttonContainer}>
        <Button title="I'll Leave"  color='black' onPress={sendSnitch}>Snitch</Button>
      <Text></Text>
        <Button title="Use A Cheat" color='black' onPress={() => props.setTrigger(false)}>Cheat Meal</Button>
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