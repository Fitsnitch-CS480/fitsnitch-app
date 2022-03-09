import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Alert, AppState } from 'react-native';
import Timer from '../models/Timer';
import SnitchPopUp from'../components/SnitchPopUp';
import ServerFacade from '../backend/ServerFacade';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export default function GetSnitchedView({ navigation, route }: { navigation: any, route: any }) {
    const [buttonPopup, setButtonPopup] = useState(false);
    const [timedPopUp, setTimedPopUp] = useState(false);
    const timer = new Timer();
  
    useEffect(() => {

    }, [])

    let onTimesUp = async () => {
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
        ServerFacade.reportSnitch();
      }
      
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

      return (
        <View style={styles.container}>
          <View>
            <View>
              <SnitchPopUp trigger={true} setTrigger={setButtonPopup}>
                <Timer onTimesUp={onTimesUp} duration={30}/>
              </SnitchPopUp>
            </View>
          </View>
        </View>
        
      );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'white',
    },
    greeting: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 16
    },
    container2: {
      marginTop: 100
    }
});
