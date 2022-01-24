import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Profile from '../components/Profile';
import User from '../shared/models/User';

const dummyUser = new User("userId","Andre","Miller");

const UserProfileView: React.FC = () => {

  return (
    <Profile user={dummyUser} />
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

export default UserProfileView;