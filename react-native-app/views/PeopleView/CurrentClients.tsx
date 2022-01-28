import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ClientTrainerService from '../../backend/services/ClientTrainerService';
import PageSection from '../../components/PageSection';
import ProfileImage from '../../components/ProfileImage';
import { userContext } from '../../navigation/mainNavigator';
import User from '../../shared/models/User';

const TITLE = "Your Clients"

const CurrentClients: React.FC = () => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(userContext)
  if (!currentUser) return null;

  let [clients, setClients] = useState<User[]>([])
  
  useEffect(()=>{
    new ClientTrainerService().getUserClients(currentUser.userId).then((clients)=>{
      setClients(clients)
    });  
  }, [])


  if (clients.length === 0) {
    return null
  }

  return (
    <PageSection title={TITLE}>
      { clients.map(client=>{
        <View style={styles.resultRow} key={client.userId} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: client})}}>
          <ProfileImage user={client} size={30}></ProfileImage>
          <Text style={{marginLeft:10, fontSize: 15}}>{client.firstname} {client.lastname}</Text>
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

export default CurrentClients;