import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import UserDataService from '../backend/services/UserDataService';
import User from '../models/User';

export type Props = {
  user: User;
};
const EMPTY_COLOR = "grey";
const PROGRESS_COLOR = "green";
const SIZE = 45;

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
    <View style={[styles.container]}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header]}>
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
          <Text style={styles.headerText}>{dummyCurrentUser.firstname} {dummyCurrentUser.lastname}</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={{}}>
            <View style={[styles.body]}>
              <Text style={{fontSize: 15, paddingBottom: 5}}>
                Trainer: Add A Trainer
              </Text>
              <Text style={{fontSize: 15, paddingBottom: 5}}>
                5 Partners: Chef Rush, +4
              </Text>
              <View style={[styles.rowContainer, {justifyContent: 'space-around'}]}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      Goals
                  </Text>
                </View>
                <View style={{}}>
                  <Text>
                    Edit
                  </Text>
                </View>
              </View>
              <View style={[styles.rowContainer, {padding: 10, backgroundColor: 'lightgrey'}]}>
                <View style={styles.progressCircle}/>
                <View style={styles.progressCircle}/>
                <View style={styles.progressCircle}/>
                <View style={styles.progressCircle}/>
              </View>


              <View style={styles.rowContainer}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold', paddingTop: 10}}>
                      Plan
                  </Text>
                </View>
                <View style={{}}>
                  <Text>
                    Edit
                  </Text>
                </View>
              </View>
              <View style={[styles.rowContainer, {backgroundColor: 'lightgrey'}]}>
                <Text style={{fontSize: 15, padding: 20}}>Update your Plan</Text>
              </View>
              <View style={[styles.rowContainer]}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold', paddingTop: 10}}>
                      Cheats Summary
                  </Text>
                </View>
                <View style={{}}>
                  <Text>
                    Edit
                  </Text>
                </View>
              </View>
              <View style={[styles.rowContainer, {backgroundColor: 'lightgrey'}]}>
              <Text style={{fontSize: 15, padding: 20}}>No Cheats to report</Text>
              </View>


              <View style={styles.updateHeader}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold', paddingTop: 10}}>
                      Updates
                  </Text>
                </View>
                <View style={{}}>
                  <Text>
                    Edit
                  </Text>
                </View>
              </View>
              <View style={[styles.updates, {backgroundColor: 'lightgrey'}]}>
                <Text>
                  Update 1
                </Text>
              </View>
              <Text></Text>
              <View style={[styles.updates, {backgroundColor: 'lightgrey'}]}>
                <Text>
                  Update 2
                </Text>
              </View>
              <Text></Text>
              <View style={[styles.updates, {backgroundColor: 'lightgrey'}]}>
                <Text>
                  Update 3
                </Text>
              </View>
              <Text></Text>
              <View style={[styles.updates, {backgroundColor: 'lightgrey'}]}>
                <Text>
                  Update 4
                </Text>
              </View>
              <Text></Text>
              <View style={[styles.updates, {backgroundColor: 'lightgrey'}]}>
                <Text>
                  Update 5
                </Text>
              </View>
              <Text></Text>
              <View style={[styles.updates, {backgroundColor: 'lightgrey'}]}>
                <Text>
                  Update 6
                </Text>
              </View>
              <Text></Text>
              <View style={[styles.updates, {backgroundColor: 'lightgrey'}]}>
                <Text>
                  Update 7
                </Text>
              </View>
              <Text></Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    fontSize: 0,
    fontWeight: 'bold',
    margin: 16,
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

export default Profile;