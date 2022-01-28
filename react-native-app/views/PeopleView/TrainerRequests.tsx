import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ClientTrainerService from '../../backend/services/ClientTrainerService';
import PageSection from '../../components/PageSection';
import ProfileImage from '../../components/ProfileImage';
import { userContext } from '../../navigation/mainNavigator';
import User from '../../shared/models/User';

const TITLE = "Your Requests"

const TrainerRequests: React.FC = () => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(userContext)
  if (!currentUser) return null;

  let [requests, setRequests] = useState<User[]>([])
  
  useEffect(()=>{
    console.log("gettin requests")
    new ClientTrainerService().getTrainerRequestsByTrainer(currentUser.userId).then((requests)=>{
      console.log({requests})
      setRequests(requests)
    });  
  }, [])


  if (requests.length === 0) {
    return null
  }

  return (
    <PageSection title={TITLE}>
      { requests.map(client=>{
        <View style={styles.resultRow} key={client.userId} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: client})}}>
          <ProfileImage user={client} size={30}></ProfileImage>
          <Text style={{marginLeft:10, fontSize: 15}}>{client.firstname} {client.lastname} wants you to train them!</Text>
        </View>
      })}
    </PageSection>
  );
};

const styles = StyleSheet.create({
  resultRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default TrainerRequests;