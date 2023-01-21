import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import User from "../../shared/models/User";
import Icon from "react-native-vector-icons/MaterialIcons";
import CheatMealService from "../../services/CheatMealService";
import { observer } from "mobx-react-lite";
import { profileContext } from "./Profile";

export type Props = {
    profileOwner: User
}

const CheatMealRemaining = observer(() => {
  const [cheats, setCheats] = useState<number>(0);
  const [allottedCheats, setAllottedCheats] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const {profileOwner} = useContext(profileContext)

  useEffect(()=>{
    getData();
  }, []);

  async function getData() {
      if (profileOwner.cheatmealSchedule) {
        setAllottedCheats(Number(profileOwner.cheatmealSchedule.split("_")[1]));
        let cheatMeals = await new CheatMealService().getCheatMeals(profileOwner);
        if (cheatMeals) {
            setCheats(cheatMeals.length);
            setError(false)
        } else {
            console.log("no cheat meaals!")
            setError(true);
        }
      } else {
        console.log("no cheat meaal schedule!!")
        setError(true);
      }
  }

  return (
    <View>
        { error ? <></> :
          <View style={styles.wrapper}>
            <View style={styles.cheatIcon}><Icon name="fastfood" color="black" size={40} /></View>
            <Text style={styles.cheatRemaining}>{Math.max(0, allottedCheats - cheats)} remaining</Text>
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
    }
});

export default CheatMealRemaining;