import User from "../shared/models/User";
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/MaterialIcons";
import CheatMealService from "../backend/services/CheatMealService";

export type Props = {
    profileOwner: User
}
  
const CheatMealRemaining: React.FC<Props> = ({
  profileOwner
}) => {
  const [cheats, setCheats] = useState<number>(0);
  const [allottedCheats, setAllottedCheats] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  useEffect(()=>{
    getData();
  }, []);

  async function getData() {
      if (profileOwner.cheatmealSchedule) {
        setAllottedCheats(profileOwner.cheatmealSchedule.split("_")[1]);
        let cheatMeals = await new CheatMealService().getCheatMeals(profileOwner);
        if (cheatMeals) {
            setCheats(cheatMeals.length);
            setRemaining(allottedCheats - cheats);
        } else {
            setError(true);
        }
      } else {
        setError(true);
      }
  }

  return (
    <View>
        { error ? <></> :
          <View style={styles.wrapper}>
            <View style={styles.cheatIcon}><Icon name="fastfood" color="black" size={50} /></View>
            <Text style={styles.cheatRemaining}>{remaining} remaining</Text>
          </View>
        }
    </View>
  )

}

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