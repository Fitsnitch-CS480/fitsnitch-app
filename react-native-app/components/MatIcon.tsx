import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MatIconName } from './MatIconName';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react-lite';

type props = {
  name: MatIconName,
  size: number,
  color?: string,
  onPress?: ()=>void
}

const MatIcon = observer<props>((props) => {
  return (
    <Icon {...props} />
  )
})

export default MatIcon;