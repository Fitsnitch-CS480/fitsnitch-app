import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import Timer from '../models/Timer';
import SnitchPopUp from'../components/SnitchPopUp';
import ServerFacade from '../backend/ServerFacade';
import sound1 from '../assets/chefRushSoundBytes/sound1.m4a';
import sound2 from '../assets/chefRushSoundBytes/sound2.m4a';
import sound3 from '../assets/chefRushSoundBytes/sound3.m4a';
import sound4 from '../assets/chefRushSoundBytes/sound4.m4a';
import sound5 from '../assets/chefRushSoundBytes/sound5.m4a';
import sound6 from '../assets/chefRushSoundBytes/sound6.m4a';

import Sound from 'react-native-sound';

export type Props = {
  name: string;
};
const SnitchesView: React.FC<Props> = ({
  name
}) => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [timedPopUp, setTimedPopUp] = useState(false);
  const timer = new Timer();
  // Sound.setCatergory('Playback');

  const voice1 = new Sound(sound1, Sound.MAIN_BUNDLE, (error) =>{
    if(error) {
      console.log("failed to load sound", error);
      return;
    }
    console.log("duration in seconds: " + sound1.getDuration()+ "\n");
  });
  const voice2 = new Sound(sound2, Sound.MAIN_BUNDLE, (error) =>{
    if(error) {
      console.log("failed to load sound", error);
      return;
    }
    console.log("duration in seconds: " + sound1.getDuration()+ "\n");
  });
  const voice3 = new Sound(sound3, Sound.MAIN_BUNDLE, (error) =>{
    if(error) {
      console.log("failed to load sound", error);
      return;
    }
    console.log("duration in seconds: " + sound1.getDuration()+ "\n");
  });
  const voice4 = new Sound(sound4, Sound.MAIN_BUNDLE, (error) =>{
    if(error) {
      console.log("failed to load sound", error);
      return;
    }
    console.log("duration in seconds: " + sound1.getDuration()+ "\n");
  });
  const voice5 = new Sound(sound5, Sound.MAIN_BUNDLE, (error) =>{
    if(error) {
      console.log("failed to load sound", error);
      return;
    }
    console.log("duration in seconds: " + sound1.getDuration()+ "\n");
  });
  const voice6 = new Sound(sound6, Sound.MAIN_BUNDLE, (error) =>{
    if(error) {
      console.log("failed to load sound", error);
      return;
    }
    console.log("duration in seconds: " + sound1.getDuration()+ "\n");
  });
  voice1.setVolume(1);
  voice2.setVolume(1);
  voice3.setVolume(1);
  voice4.setVolume(1);
  voice5.setVolume(1);
  voice6.setVolume(1);


  let onTimesUp = async () => {
    setButtonPopup(false);
    Alert.alert("You've Been Snitched On!",
    "Open FitSnitch to request a change or use a cheat meal");
    //Send snitch
    ServerFacade.reportSnitch();
  }
  
  let checkLocation = async () => {
    const response = await ServerFacade.checkLocation();
    console.log(response);
    if(response.status == 200){
      voice1.play(success => {
        if(success){
          voice2.play(success => {
            if(success){
              voice3.play(success => {
                if(success){
                  voice4.play(success => {
                    if(success){
                      voice5.play(success => {
                        if(success){
                          voice6.play();
                        }
                        else{
                          console.log("failed to play 6");
                        }
                      });
                    }
                    else{
                      console.log("failed to play 5");
                    }
                  });
                }
                else{
                  console.log("failed to play 4");
                }
              });
            }
            else{
              console.log("failed to play 2");
            }
          });
        }
        else{
          console.log("failed to play 1");
        }
      }
      );
      setButtonPopup(true);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <View>
          <SnitchPopUp trigger={buttonPopup} setTrigger={setButtonPopup}>
            <Timer onTimesUp={onTimesUp} duration={30}/>
          </SnitchPopUp>
        </View>
        <View style={styles.container2}>
          <Text style={styles.greeting}>
          Demo Snitch on {name || "Andre"}
          {checkLocation}
          </Text>
            <Button
            title="Run Demo"
            accessibilityLabel="demo"
            onPress={checkLocation} 
            color="black"
            />
        </View>
      </View>
    </View>
    
  );
};

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

export default SnitchesView;