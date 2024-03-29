import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ClientTrainerService from '../../services/ClientTrainerService';
import Card from '../../components/Card';
import ProfileImage from '../../components/ProfileImage';
import User from '../../shared/models/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../../utils/UiUtils';
import Badge from '../../components/Badge';
import { globalContext } from '../GlobalContext';
import { observer } from 'mobx-react-lite';

const TITLE = "Trainer Requests"

const TrainerRequests = observer(() => {
  const navigation = useNavigation<any>();
  const {userStore, trainerRequestsForUser, clientStore} = useContext(globalContext);
  const currentUser = userStore.currentUser;

  const requests = trainerRequestsForUser.data

  if (requests.length === 0) {
    return null
  }

  async function approveRequest(client:User) {
    if (!currentUser) return null;
    await new ClientTrainerService().approveClient(currentUser, client);
    trainerRequestsForUser.fetch();
    clientStore.fetch();
    notifyMessage("Approved Trainer Request!")
  }

  async function deleteRequest(client:User) {
    if (!currentUser) return null;
    await new ClientTrainerService().cancelTrainerRequest(currentUser, client);
    trainerRequestsForUser.fetch();
    notifyMessage("Deleted Trainer Request")
  }

  return (
    <Card title={TITLE} headerRight={<Badge qty={requests.length} size={25} />}>
      { requests.map((client,i)=>(
        <View key={client.userId}>
        <View style={styles.resultRow}>
          <View style={styles.clientInfo} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: client})}}>
            <ProfileImage user={client} size={35}></ProfileImage>
            <Text style={{marginLeft:10, fontSize: 15, color: "white"}}>{client.firstname} {client.lastname}</Text>  
          </View>
          <Button title="Train" onPress={()=>approveRequest(client)} />
          <View style={styles.deleteButton} onTouchEnd={()=>deleteRequest(client)}><Icon name="delete" size={25} color="white"></Icon></View>
        </View>
        { (i < requests.length - 1) ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </Card>
  );
});

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