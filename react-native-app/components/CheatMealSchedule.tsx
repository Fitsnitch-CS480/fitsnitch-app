import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import User from '../shared/models/User';
import InputSpinner from "react-native-input-spinner";
import {Picker} from '@react-native-picker/picker';
import UserDataService from '../backend/services/UserDataService';

export type Props = {
  profileOwner: User
}

const CheatMealSchedule: React.FC<Props> = ({
  profileOwner
}) => {
  const [period, setPeriod] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(()=>{
    if (profileOwner.cheatmealSchedule) {
      let split = profileOwner.cheatmealSchedule.split("_");
      setPeriod(split[0]);
      setQuantity(Number.parseInt(split[1]));
    }
  }, []);
  
  async function updateSchedule(period, quantity) {
    profileOwner.cheatmealSchedule = period + "_" + quantity.toString();
    let updateResult = await new UserDataService().updateUser(profileOwner);
  }

  return(
    <View>
      <Text style={styles.title}>Cheat Meal Schedule</Text>
      <View style={styles.container}>
        <InputSpinner
          style={styles.spinner}
          min={0}
          value={quantity}
          color={'lightcoral'} // change when we make the app look pretty :)
          onChange={(num: number) => {
            updateSchedule(period, num);
            setQuantity(num);
          }}
          buttonFontSize={25}
          buttonLeftText="—" // A longer version of -
          skin={"modern"}
        />
        <Text style={styles.label}>every</Text>
        <Picker
          style={styles.picker}
          selectedValue={period}
          onValueChange={(itemValue: string) => {
            if (itemValue != "") {
              updateSchedule(itemValue, quantity);
              setPeriod(itemValue);
            }
          }}>
          <Picker.Item label="--" value="" />
          <Picker.Item label="week" value="week" />
          <Picker.Item label="month" value="month" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black'
  },
  spinner: {
    flex: 0.5,
  },
  picker: {
    flex: 0.5
  }
});

export default CheatMealSchedule;