import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import Timer from '../models/Timer';
import SnitchPopUp from'../components/SnitchPopUp';
import ServerFacade from '../backend/ServerFacade';

export type Props = {
  name: string;
};
const SnitchesView: React.FC<Props> = ({
  name
}) => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [timedPopUp, setTimedPopUp] = useState(false);
  const timer = new Timer();
  let location: string = ""

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
    // Alert.alert("Are you currently at " + response.data.name + "?");
    if(response.status == 200){
      location =response.data.name;
      setButtonPopup(true);
    }
  }

  return (
    <View style={styles.container}>
      {/* This code remains as an example of using state and variables, but will be removed. */}
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