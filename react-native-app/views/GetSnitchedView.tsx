import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Alert, AppState } from 'react-native';
import Timer from '../models/Timer';
import ServerFacade from '../backend/ServerFacade';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { CreateSnitchRequest } from '../shared/models/requests/CreateSnitchRequest';
import { globalContext } from '../navigation/appNavigator';

export default function GetSnitchedView({ navigation, route }: any) {
  const [currentUser] = useContext(globalContext).currentUser;

    const [buttonPopup, setButtonPopup] = useState(false);
    const [timedPopUp, setTimedPopUp] = useState(false);
    const {restaurant, coords} = route.params;

    let onTimesUp = async () => {
      // TODO notify Android
        if (AppState.currentState == "background") {  //alert by notification
            let localNotification = PushNotificationIOS.addNotificationRequest({
                id: "1",
                body: "You didn't leave the restaurant in time! You've been snitched on!",
                title: "Get Snitched On!",
                category: "UHOH",
            });
        }
        setButtonPopup(false);
        Alert.alert("You've Been Snitched On!", "Open FitSnitch to request a change or use a cheat meal");
        //Send snitch
        ServerFacade.snitchOnUser(new CreateSnitchRequest(currentUser.userId, restaurant, coords));
      }
      
      // The code belows is a resource for reimplementing the Chef soundclips
      let checkLocation = async () => {
        //navigate.push("GetSnitchedOn")
        // const response = await ServerFacade.checkLocation(-1,-1);
        // console.log(response);
        // if(response.status == 200){
        //   voice1.play(success => {
        //     if(success){
        //       voice2.play(success => {
        //         if(success){
        //           voice3.play(success => {
        //             if(success){
        //               voice4.play(success => {
        //                 if(success){
        //                   voice5.play(success => {
        //                     if(success){
        //                       voice6.play();
        //                     }
        //                     else{
        //                       console.log("failed to play 6");
        //                     }
        //                   });
        //                 }
        //                 else{
        //                   console.log("failed to play 5");
        //                 }
        //               });
        //             }
        //             else{
        //               console.log("failed to play 4");
        //             }
        //           });
        //         }
        //         else{
        //           console.log("failed to play 2");
        //         }
        //       });
        //     }
        //     else{
        //       console.log("failed to play 1");
        //     }
        //   }
        //   );
        //   setButtonPopup(true);
        // }
      }

      let doNothing = async () => {
        setButtonPopup(false);
        Alert.alert("Great Decision! Remember your goals!");
      }
    
      let useCheat = async () => {
        setButtonPopup(false);
        Alert.alert("Checking if you have cheats available. Otherwise you will be snitched on!");
      }
      
      return (
       <View style={styles.container}>
          <Text style={styles.text1}>Are you at {restaurant.name}?</Text>
          <Text></Text>
          
          <Timer onTimesUp={onTimesUp} duration={30}/>
        
          <Text></Text>
          <Text style={styles.text2}>Select an option below to stop us from snitching on you! </Text>
          <Text></Text>

          <View style={styles.buttonContainer}>
            <Button title="I'll Leave" color='black' onPress={doNothing}>Snitch</Button>
            <Text>   </Text>
            <Button title="Use A Cheat" color='black' onPress={useCheat}>Cheat Meal</Button>
          </View>
          <Text style={styles.errorText}>Report an error</Text>
       </View>
     );

}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  errorText: {
    alignSelf: "center",
    textDecorationLine: 'underline'
  },

  text1:{
    color: 'black',
    alignSelf: "center",
    fontSize: 30,
  },

  text2:{
    color: 'black',
    alignSelf: "center",
    fontSize: 20,
  },

  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
});
