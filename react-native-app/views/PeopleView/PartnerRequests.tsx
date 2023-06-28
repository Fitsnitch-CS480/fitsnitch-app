import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PartnerAssociationService from '../../services/PartnerAssociationService';
import Card from '../../components/Card';
import ProfileImage from '../../components/ProfileImage';
import User from '../../shared/models/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../../utils/UiUtils';
import Badge from '../../components/Badge';
import { globalContext } from '../appNavigator';
import { observer } from 'mobx-react-lite';

const TITLE = "Partner Requests"

const PartnerRequests = observer(() => {
  const navigation = useNavigation<any>();
  const {currentUser, partnerStore, partnerRequestsForUser} = useContext(globalContext);

  const requesters = partnerRequestsForUser.data;

  if (requesters.length === 0) {
    return null
  }

  async function approveRequest(requester:User) {
    if (!currentUser) return null;
    await new PartnerAssociationService().approveRequest(requester, currentUser);
    notifyMessage("Approved Request!")
    partnerRequestsForUser.fetch()
    partnerStore.fetch()
  }

  async function deleteRequest(requester:User) {
    if (!currentUser) return null;
    await new PartnerAssociationService().deleteRequest(requester, currentUser);
    partnerRequestsForUser.fetch()
    notifyMessage("Deleted Request")
  }

  return (
    <Card title={TITLE} headerRight={<Badge qty={requesters.length} size={25} />}>
      { requesters.map((requester,i)=>(
        <View key={requester.userId}>
          <View style={styles.resultRow}>
            <View style={styles.clientInfo} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: requester})}}>
              <ProfileImage user={requester} size={35}></ProfileImage>
              <Text style={{marginLeft:10, fontSize: 15, color: "white"}}>{requester.firstname} {requester.lastname}</Text>  
            </View>
            <Button title="Accept" onPress={()=>approveRequest(requester)} />
            <View style={styles.deleteButton} onTouchEnd={()=>deleteRequest(requester)}><Icon name="delete" size={25} color="white"></Icon></View>
          </View>
          { (i < requesters.length - 1) ? <View style={styles.divider} /> : null}
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

export default PartnerRequests;