import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, Dimensions, useWindowDimensions } from 'react-native';
import Profile from '../components/Profile';
import User from '../models/User';

const dummyUser = new User("userId","Andre","Miller");

//for rings
const EMPTY_COLOR = "grey";
const PROGRESS_COLOR = "green";
const SIZE = 45;


const UserProfileView: React.FC = () => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
            }}
            //borderRadius will help to make Round Shape
            style={{
              width: 75,
              height: 75,
              borderRadius: 200 / 2,
            }}
          />
         <Text style={styles.headerText}>{dummyUser.firstname} {dummyUser.lastname}</Text>
      </View>

      <View style={[styles.body, {justifyContent: 'space-around'}]}>
        <Text>
          Trainer: Add A Trainer
        </Text>
        <Text>
          5 Partners: Chef Rush, +4
        </Text>
      <View style={[styles.rowContainer, {justifyContent: 'space-around'}]}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>
              Your Goals
           </Text>
        </View>
        <View style={{}}>
          <Text>
            Edit
          </Text>
        </View>
      </View>
        <View style={[styles.rowContainer, {backgroundColor: 'white'}]}>
          <View style={styles.progressCircle}/>
          <View style={styles.progressCircle}/>
          <View style={styles.progressCircle}/>
          <View style={styles.progressCircle}/>
        </View>
      </View>

      <View style={[styles.body, {justifyContent: 'space-around'}]}>
        <View style={styles.rowContainer}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                Your Plan
            </Text>
          </View>
          <View style={{}}>
            <Text>
              Edit
            </Text>
          </View>
        </View>
        <View style={[styles.rowContainer, {backgroundColor: 'white'}]}>
          <View style={styles.progressCircle}/>
        </View>
        <View style={[styles.rowContainer]}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                Cheats Summary
            </Text>
          </View>
          <View style={{}}>
            <Text>
              Edit
            </Text>
          </View>
        </View>
        <View style={[styles.rowContainer, {backgroundColor: 'white'}]}>
          <View style={styles.progressCircle}/>
        </View>
      </View>

      <View style={[styles.body, {justifyContent: 'space-around'}]}>
        <View style={styles.rowContainer}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                Your Updates
            </Text>
          </View>
          <View style={{}}>
            <Text>
              Edit
            </Text>
          </View>
        </View>
        <View style={[styles.rowContainer, {backgroundColor: 'white'}]}>
          <View style={styles.progressCircle}/>
        </View>
        <View style={[styles.rowContainer, {backgroundColor: 'white'}]}>
          <View style={styles.progressCircle}/>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  greeting: {
    fontSize: 0,
    fontWeight: 'bold',
    margin: 16
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    textAlign: 'left',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    flex: 2,
    backgroundColor:'white', 
    color: 'black',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 40,
  },
  profileName: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  body: {
    flex: 2,
    backgroundColor: 'blue',
    padding: 20,
  },
  body2: {
    flex: 2,
    backgroundColor: 'blue',
    padding: 20,
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
  }
});

export default UserProfileView;