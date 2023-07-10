import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import User from "../../shared/models/User";
import Icon from "react-native-vector-icons/MaterialIcons";
import CheatMealService from "../../services/CheatMealService";
import { observer } from "mobx-react-lite";
import { profileContext } from "./Profile";
import { request } from '../../services/ServerFacade';

export type Props = {
    profileOwner: User
}

const CheatMealRemaining = observer(() => {
  const [summary, setSummary] = useState<{schedule: string, used: number, remaining: number} | undefined>();
  const {profileOwner} = useContext(profileContext)

  useEffect(()=>{
    getData();
  }, [profileOwner.cheatmealSchedule]);

  async function getData() {
      if (profileOwner.cheatmealSchedule) {
		const {data: {data: cheatMealSummary}} = await request.get('/cheat/summary/' + profileOwner.userId);
		setSummary(cheatMealSummary);
      }
  }

  return (
    <View>
        { (profileOwner.cheatmealSchedule && summary) &&
          <View style={styles.wrapper}>
            <View style={styles.cheatIcon}><Icon name="fastfood" color="white" size={40} /></View>
            <Text style={styles.cheatRemaining}>{Math.max(summary.remaining)} remaining</Text>
          </View>
        }
    </View>
  )

});

const styles = StyleSheet.create({
    wrapper: {
        height: 50,
        paddingLeft: 60,
        marginBottom: 20,
        position: 'relative',
    },
    cheatIcon: {
        position: "absolute",
        left: 0,
        zIndex: 5
    },
    cheatRemaining: {
        fontSize: 28,
        lineHeight: 50,
		color: 'white',
    }
});

export default CheatMealRemaining;