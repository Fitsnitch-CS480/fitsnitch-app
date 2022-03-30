import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Alert, AppState } from 'react-native';
import Timer from '../models/Timer';
import ServerFacade from '../backend/ServerFacade';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { CreateSnitchRequest } from '../shared/models/requests/CreateSnitchRequest';
import { globalContext } from '../navigation/appNavigator';
import {observer} from 'mobx-react-lite'
import CheatMealEvent from '../shared/models/CheatMealEvent';
import Sound from 'react-native-sound';
import useInterval from '../hooks/useInterval';

const soundFiles = [
  require('../assets/chefRushSoundBytes/sound1.m4a'),
  require('../assets/chefRushSoundBytes/sound2.m4a'),
  require('../assets/chefRushSoundBytes/sound3.m4a'),
  require('../assets/chefRushSoundBytes/sound5.m4a'),
  require('../assets/chefRushSoundBytes/sound6.m4a'),
  // This one has the countdown, so it can be last.
  // These tracks with the current config take exactly
  // 30 seconds to play 
  require('../assets/chefRushSoundBytes/sound4.m4a'),
]

let longestDuration = 0;

const sounds = soundFiles.map(file => {
  let sound = new Sound(file, Sound.MAIN_BUNDLE, (error) =>{
    if(error) {
      console.log("failed to load sound", error);
      return;
    }
  })
  if (sound.getDuration() > longestDuration) {
    longestDuration = sound.getDuration();
  }
  sound.setVolume(1);
  return sound;
});

const soundWaitTime = 5100 + (longestDuration * 1000)

export default observer(function GetSnitchedView({ navigation, route }: any) {
    const {currentUser, locationStore} = useContext(globalContext);

    const [buttonPopup, setButtonPopup] = useState(false);
    const [didSnitch, setDidSnitch] = useState(false);
    const [nextSoundIdx, setNextSoundIdx] = useState(0);
    const {restaurant, coords} = route.params;


    function playNextSound() {
      if (didSnitch) return;
      sounds[nextSoundIdx].play((success)=>{
        if (!success) {
          console.log("Could not play sound!")
        }
      })
      setNextSoundIdx((nextSoundIdx+1)%sounds.length)
    }

    useEffect(()=>{
      playNextSound()
    }, [])

    useInterval(playNextSound,soundWaitTime)

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
        setDidSnitch(true)
        locationStore.onSnitchOrCheat(coords)

        //Send snitch
        ServerFacade.snitchOnUser(new CreateSnitchRequest(currentUser.userId, restaurant, coords));
      }

      let commitToLeave = async () => {
        setButtonPopup(false);
        Alert.alert("Great Decision! Remember your goals!");
        locationStore.onCommittedToLeave()
        navigation.goBack(null)
      }
    
      let useCheat = async () => {
        locationStore.onSnitchOrCheat(coords)
        setButtonPopup(false);
        Alert.alert("Checking if you have cheats available. Otherwise you will be snitched on!");
        let cheat = new CheatMealEvent(currentUser.userId, new Date().toISOString(), coords, restaurant)
        await ServerFacade.createCheatMeal(cheat)
        navigation.goBack(null)
      }
      
      return (
       <View style={styles.container}>

        { didSnitch?
        
        <>
          <Text style={styles.text1}>You've been snitched on!</Text>
          <Text style={styles.text2}>Now all of your partners know you were at {restaurant.name}.</Text>
        </>

        :

        <>
          <Text style={styles.text1}>Are you at {restaurant.name}?</Text>
          <Text></Text>
          
          <Timer onTimesUp={onTimesUp} duration={30}/>
        
          <Text></Text>
          <Text style={styles.text2}>Select an option below to stop us from snitching on you! </Text>
          <Text></Text>

          <View style={styles.buttonContainer}>
            <Button title="I'll Leave" color='black' onPress={commitToLeave}>Snitch</Button>
            <Text>   </Text>
            <Button title="Use A Cheat" color='black' onPress={useCheat}>Cheat Meal</Button>
          </View>
        
        </>}

        <Text style={styles.errorText}>Report an error</Text>

       </View>
     );

})

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

      
      // The code belows is a resource for reimplementing the Chef soundclips
      // let checkLocation = async () => {
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
      // }