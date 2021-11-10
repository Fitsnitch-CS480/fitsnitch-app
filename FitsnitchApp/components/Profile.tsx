import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import UserDataService from '../backend/services/UserDataService';
import User from '../models/User';

export type Props = {
  user: User;
};

const dummyCurrentUser = new User("currentUser","Current","User");

const Profile: React.FC<Props> = ({
  user
}) => {

  const isCurrentUser = ():boolean => {
    return user.id === dummyCurrentUser.id;
  }
  const isCurrentUserTrainer = ():boolean => {
    return new UserDataService().isUserTrainerOfUser(dummyCurrentUser,user);
  }
  const isCurrentUserPartner = ():boolean => {
    return new UserDataService().isUserPartnerOfUser(dummyCurrentUser,user);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Profile
      </Text>
      
      <Text>
        {user.firstname} {user.lastname}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16
  }
});

export default Profile;