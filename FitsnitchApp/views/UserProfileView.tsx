import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, Dimensions, useWindowDimensions, ScrollView, FlatList, SectionList } from 'react-native';
import Profile from '../components/Profile';
import User from '../models/User';

const dummyUser = new User("userId","Andre","Miller");

//for rings
const EMPTY_COLOR = "grey";
const PROGRESS_COLOR = "green";
const SIZE = 45;

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
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  updateHeader: {
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    maxHeight:150,
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    textAlign: 'left',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderTopColor: 'black',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    flex: 2,
    backgroundColor:'white', 
    color: 'black',
    textAlign: 'center',
    fontSize: 40,
  },
  profileName: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  body: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-around'
  },
  progressCircle: {
    flexDirection: 'row',
    borderColor: EMPTY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 7,
  },
  indicator: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 7,
    position: 'absolute',
    borderLeftColor: PROGRESS_COLOR,
    borderTopColor: PROGRESS_COLOR,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },

  updates: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    fontSize: 15, 
    padding: 20
  },
});

export default UserProfileView;