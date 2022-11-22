import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Colors from '../assets/constants/colors';

const NameLink = ({user}) => {
  const nav = useNavigation();

  return (
    <Text style={styles.nameLink}
          onPress={()=>nav.navigate('OtherUserProfile', {profileOwner: user})}
    >
      {user.firstname+" "+user.lastname}
    </Text>
  )
}

const styles = StyleSheet.create({
  nameLink: {
    color: Colors.lightBlue,
  }
})

export default NameLink;