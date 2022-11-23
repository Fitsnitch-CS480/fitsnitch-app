import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import User from '../shared/models/User';
import InputSpinner from "react-native-input-spinner";
import {Picker} from '@react-native-picker/picker';
import UserDataService from '../backend/services/UserDataService';
import MatButton from './MatButton';
import Colors from '../assets/constants/colors';
import T from '../assets/constants/text';

export type Props = {
  profileOwner: User,
  canEdit: boolean
}

const CheatMealSchedule: React.FC<Props> = ({
  profileOwner,
  canEdit
}) => {
  const [period, setPeriod] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [editing, setEditing] = useState<boolean>(false);
  const [working, setWorking] = useState<boolean>(false);

  useEffect(()=>{
    if (profileOwner.cheatmealSchedule) {
      let split = profileOwner.cheatmealSchedule.split("_");
      setPeriod(split[0]);
      setQuantity(Number.parseInt(split[1]));
    }
  }, []);

  async function updateSchedule(period, quantity) {
    setQuantity(quantity);
    setPeriod(period);
    profileOwner.cheatmealSchedule = period + "_" + quantity.toString();
    setWorking(true);
    await new UserDataService().updateUser(profileOwner);
    setWorking(false);
  }

  function toggleEdit() {
    setEditing(!editing)
  }

  return(
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{T.cheatmeal.schedule}</Text>
        {canEdit && 
          <MatButton 
            style={{width: 40}} 
            textColor={Colors.white}
            color={Colors.background}
            secondary 
            loading={working}
            icon={editing? 'check' : 'edit'} 
            onPress={toggleEdit} /> }
      </View>
      <View style={styles.container}>
        { editing ?
          <>
          <InputSpinner
            style={styles.spinner}
            min={0}
            value={quantity}
            color={Colors.red}
            onChange={(num: number) => {
              updateSchedule(period, num);
            }}
            buttonFontSize={25}
            buttonLeftText="—" // A longer version of -
            skin={"modern"}
          />
          <Text style={styles.label}>{T.cheatmeal.every}</Text>
          <Picker
            style={styles.picker}
            selectedValue={period}
            onValueChange={(itemValue: string) => {
              updateSchedule(itemValue, quantity);
            }}>
            <Picker.Item label="--" value="" />
            <Picker.Item label="week" value="week" />
            <Picker.Item label="month" value="month" />
          </Picker>
          </>
        :
          <Text style={styles.summary}>{period ? `${quantity} every ${period}` : 'No schedule'}</Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.white
  },
  summary: {
    fontSize: 18,
    color: Colors.white,
  },
  spinner: {
    flex: 0.5,
  },
  picker: {
    flex: 0.5,
    backgroundColor: Colors.white,
    marginLeft: 10,
  }
});

export default CheatMealSchedule;