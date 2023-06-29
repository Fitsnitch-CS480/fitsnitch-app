import React, {  } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SnitchEvent from '../shared/models/SnitchEvent';
import dayjs from 'dayjs';
import Colors from '../assets/constants/colors';

export type Props = {
  lastSnitch?: SnitchEvent;
  size: number;
};

const SnitchFreeStreak: React.FC<Props> = ({
  lastSnitch, size
}) => {
  
  let streak = (() => {
    if (!lastSnitch) return '--';
    else return dayjs().diff(dayjs(lastSnitch.created_at), 'd')
  })();

  const fireColor = streak === 0 || streak === '--' ? '#999' : 'red'

  const styles = StyleSheet.create({
    streakWrapper: {
      height: size,
      minWidth: size*.75 + (String(streak).length*size*.7),
      paddingLeft: size*.8,
      paddingTop: size*.1,
      position: 'relative',
    },
    streakFire: {
      position: "absolute",
      left: 0,
      top: size*.1,
      zIndex: 5
    },
    streakQty: {
      fontSize: size * .8,
      lineHeight: size * .8,
      color: Colors.white
    },
  });
  

  return (
    <View style={styles.streakWrapper}>
      <View style={styles.streakFire}><Icon name="whatshot" color={fireColor} size={size*.8} /></View>
      <Text style={styles.streakQty}>{streak}</Text>
    </View>
  );
};


export default SnitchFreeStreak;
