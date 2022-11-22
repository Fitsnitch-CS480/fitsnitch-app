import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ClientTrainerService from '../../backend/services/ClientTrainerService';
import Card from '../../components/Card';
import ProfileImage from '../../components/ProfileImage';
import { globalContext } from '../../navigation/appNavigator';
import User from '../../shared/models/User';

const TITLE = "Your Clients"

const CurrentClients = observer(() => {
  const navigation = useNavigation<any>();
  const {clientStore} = useContext(globalContext);

  const clients = clientStore.data;

  if (clientStore.loading) {
    return (
    <Card title={TITLE}>
      <ActivityIndicator color="#00bbff" size={30} />
    </Card>
    )
  }
  
  if (clients.length === 0) {
    return (
      <Card title={TITLE}>
        <Text>You have no clients yet!</Text>
      </Card>
    )
  }


  return (
    <Card title={TITLE}>
      { clients.map((client,i)=>(
        <View key={client.userId}>
          <View style={styles.resultRow} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: client})}}>
            <ProfileImage user={client} size={30}></ProfileImage>
            <Text style={{marginLeft:10, fontSize: 15}}>{client.firstname} {client.lastname}</Text>  
          </View>
          { (i < clients.length - 1) ? <View style={styles.divider} /> : null}
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
    paddingVertical: 10,
    width: '100%'
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

export default CurrentClients;