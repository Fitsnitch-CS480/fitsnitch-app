import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ClientTrainerService from '../../backend/services/ClientTrainerService';
import PageSection from '../../components/PageSection';
import ProfileImage from '../../components/ProfileImage';
import { userContext } from '../../navigation/mainNavigator';
import User from '../../shared/models/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../../utils/UiUtils';

const TITLE = "Trainer Requests"

const TrainerRequests: React.FC = () => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(userContext)
  if (!currentUser) return null;

  let [requests, setRequests] = useState<User[]>([])
  
  useEffect(()=>{
    new ClientTrainerService().getTrainerRequestsByTrainer(currentUser.userId).then((requests)=>{
      console.log({requests})
      setRequests(requests)
    });  
  }, [])

  if (requests.length === 0) {
    return null
  }

  async function approveRequest(client:User) {
    if (!currentUser) return null;
    await new ClientTrainerService().approveClient(currentUser, client);
    requests = requests.filter(r=>r!==client);
    setRequests(requests)
    notifyMessage("Approved Trainer Request!")
  }

  async function deleteRequest(client:User) {
    if (!currentUser) return null;
    await new ClientTrainerService().cancelTrainerRequest(currentUser, client);
    requests = requests.filter(r=>r!==client);
    setRequests(requests)
    notifyMessage("Deleted Trainer Request")
  }

  return (
    <PageSection title={TITLE}>
      { requests.map((client,i)=>(
        <View key={client.userId}>
        <View style={styles.resultRow}>
          <View style={styles.clientInfo} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: client})}}>
            <ProfileImage user={client} size={35}></ProfileImage>
            <Text style={{marginLeft:10, fontSize: 15}}>{client.firstname} {client.lastname}</Text>  
          </View>
          <Button title="Train" onPress={()=>approveRequest(client)} />
          <View style={styles.deleteButton} onTouchEnd={()=>deleteRequest(client)}><Icon name="delete" size={25}></Icon></View>
        </View>
        { (i < requests.length - 1) ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </PageSection>
  );
};

const styles = StyleSheet.create({
  resultRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  clientInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1
  },
  deleteButton: {
    paddingLeft: 10
  },
  divider: {
    width: '100%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  }
});

export default TrainerRequests;