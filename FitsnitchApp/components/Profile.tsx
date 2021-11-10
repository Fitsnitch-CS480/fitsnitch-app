import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import User from '../models/User';

export type Props = {
  user: User;
};

const Profile: React.FC<Props> = ({
  user
}) => {

  const isCurrentUser = () => {
    
  }
  const isCurrentUserTrainer = () => {

  }
  const isCurrentUserPartner = () => {

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