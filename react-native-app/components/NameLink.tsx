import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

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
    color: 'black',
    textDecorationLine: 'underline'
  }
})

export default NameLink;