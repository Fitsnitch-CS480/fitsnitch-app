import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Alert, AppState } from 'react-native';
import Timer from '../reusable-components/Timer';
import ServerFacade from '../services/ServerFacade';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { CreateSnitchRequest } from '../shared/models/requests/CreateSnitchRequest';
import { globalContext } from '../views/appNavigator';
import {observer} from 'mobx-react-lite'
import CheatMealEvent from '../shared/models/CheatMealEvent';
import Sound from 'react-native-sound';
import useInterval from '../hooks/useInterval';
import CheatMealService from '../services/CheatMealService';
import SnitchEvent from '../shared/models/SnitchEvent';
import { LatLonPair } from '../shared/models/CoordinateModels';
import NativeModuleService from '../services/NativeModuleService';
import SnitchTrigger from '../shared/models/SnitchTrigger';
import { useFocusEffect } from '@react-navigation/native';

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

type Props = {
  navigation: any,
  route: any,
  trigger: number,
}

export default observer(function GetSnitchedView({ navigation, route, trigger }: Props) {
  const {currentUser, /*locationStore*/} = useContext(globalContext);

  const [snitch, setSnitch] = useState<SnitchTrigger|null>(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [timePassed, setTimePassed] = useState(false);
  const [nextSoundIdx, setNextSoundIdx] = useState(0);
  const [useCheats, setUseCheats] = useState<boolean>(false);

  const [isVisible, setIsVisible] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true)

      return () => {
        setIsVisible(false)
      }
    }, [])
  );

  async function getCheatMealData() {
    if (currentUser.cheatmealSchedule) {
      let cheatsAllotted = Number(currentUser.cheatmealSchedule.split("_")[1]);
      let cheatMeals = await new CheatMealService().getCheatMeals(currentUser);
      let cheatsUsed;
      let remaining;
      if (cheatMeals) {
          cheatsUsed = cheatMeals.length;
          remaining = cheatsAllotted - cheatsUsed;
          if (remaining > 0) {
            setUseCheats(true);
          }
      }
    }
  };

  function playNextSound() {
    if (timePassed) return;
    if (isVisible) {
      sounds[nextSoundIdx].play((success)=>{
        if (!success) {
          console.log("Could not play sound!")
        }
      })
    }
    setNextSoundIdx((nextSoundIdx+1)%sounds.length)
  }

  useEffect(()=>{
    playNextSound();
      getCheatMealData();
  }, [])

  useInterval(playNextSound,soundWaitTime)


  // Receive trigger either through props or route and refresh component
  if (route?.params?.trigger) {
    trigger = route.params.trigger;
  }

  useEffect(()=>{
    console.log("NEW NEW SNITCH", trigger)
    
    NativeModuleService.getActiveSnitch(lastSnitch => {
      if (lastSnitch && (!snitch || lastSnitch.created !== snitch.created)) {
        let endTime = new Date(Number(lastSnitch.created)).getTime() + 30000;
        console.log(endTime <= Date.now())
        setTimePassed(endTime <= Date.now());
        setSnitch(lastSnitch);
        setIsVisible(true);
      }
    });   
  }, [trigger])



  let close = () => {
    if (navigation.canGoBack()) {
      navigation.goBack(null);
    }
    else navigation.navigate("Tabs");
  }

  if (!snitch) return <>
    <Text>This snitch is no longer available.</Text>
    <Button title='Go Back' onPress={close} ></Button>
  </>;


  const restaurant = snitch.restaurantData;
  const endTime = new Date(Number(snitch.created)).getTime() + 30000;


  let onTimesUp = async () => {
    console.log("CALLED TIMES UP")
	// TODO: check with NativeModule to learn whether ot not the snitch was published!
    setButtonPopup(false);
    setTimePassed(true)
    // locationStore.onSnitchOrCheat(new LatLonPair(0,0))
  }


  let commitToLeave = async () => {
    setButtonPopup(false);
    Alert.alert("Great Decision! Remember your goals!");
    // locationStore.onCommittedToLeave();
    // NativeModuleService.getModule().setWillLeave();
    close();
  }

  let useCheat = async () => {
    // locationStore.onSnitchOrCheat(new LatLonPair(0,0))
    NativeModuleService.getModule().setUsedCheat();
    setButtonPopup(false);
    // Alert.alert("Checking if you have cheats available. Otherwise you will be snitched on!");
    let cheat = new CheatMealEvent(currentUser.userId, new Date().toISOString(), new LatLonPair(0,0), restaurant)
    await ServerFacade.createCheatMeal(cheat)
    navigation.goBack(null);
    close();
  }

  

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>

    { timePassed?
    
    <>
      <Text style={styles.text1}>You've been snitched on!</Text>
      <Text style={styles.text2}>Now all of your partners know you were at {restaurant?.name}.</Text>
    </>

    :

    <>
      <Text style={styles.text1}>Are you at {restaurant?.name}?</Text>
      <Text></Text>
      
      <Timer onTimesUp={onTimesUp} endTime={endTime}/>
    
      <Text></Text>
      <Text style={styles.text2}>Select an option below to stop us from snitching on you! </Text>
      <Text></Text>

      <View style={styles.buttonContainer}>
        <Button title="I'll Leave" color='black' onPress={commitToLeave}></Button>
        <Text>   </Text>
            { useCheats ?
        		<Button title="Use A Cheat" color='black' onPress={useCheat}></Button>
          		: <></>
            }
      </View>
    
    </>
    }

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
