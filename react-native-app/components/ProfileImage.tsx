import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import User from '../shared/models/User';

export type Props = {
  user: User;
  size: number
};
const ProfileImage: React.FC<Props> = ({
  user, size
}) => {

  const initials = (user.firstname && user.lastname)? `${user.firstname[0]+user.lastname[0]}` : undefined;

  return (
    <View style={[styles.imageWrapper, {width: size, height:size}]}>
      {/* TODO: support user profile images!!! */}
      { initials?
          <Text style={[styles.initials, {fontSize:size*.4}]}>{initials}</Text>
        :
          <Icon name="person" size={size * .75} color="white"></Icon>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: "#555"
  },
  initials: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: "white"
  }
})

export default ProfileImage;