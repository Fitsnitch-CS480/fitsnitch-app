import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PartnerAssociationService from '../../backend/services/PartnerAssociationService';
import PageSection from '../../components/PageSection';
import ProfileImage from '../../components/ProfileImage';
import { userContext } from '../../navigation/mainNavigator';
import User from '../../shared/models/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../../utils/UiUtils';
import Badge from '../../components/Badge';

const TITLE = "Partner Requests"

const PartnerRequests: React.FC<{onChange?:(...arg:any[])=>any}> = ({onChange}) => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(userContext)
  if (!currentUser) return null;

  let [requesters, setRequesters] = useState<User[]>([])
  
  useEffect(()=>{
    new PartnerAssociationService().getPartnerRequesters(currentUser.userId).then((requesters)=>{
      setRequesters(requesters)
    });  
  }, [])

  if (requesters.length === 0) {
    return null
  }

  async function approveRequest(requester:User) {
    if (!currentUser) return null;
    await new PartnerAssociationService().approveRequest(requester, currentUser);
    requesters = requesters.filter(r=>r!==requester);
    setRequesters(requesters)
    notifyMessage("Approved Request!")
    if (onChange) onChange();
  }

  async function deleteRequest(requester:User) {
    if (!currentUser) return null;
    await new PartnerAssociationService().deleteRequest(requester, currentUser);
    requesters = requesters.filter(r=>r!==requester);
    setRequesters(requesters)
    notifyMessage("Deleted Request")
    if (onChange) onChange();
  }

  return (
    <PageSection title={TITLE} headerRight={<Badge qty={requesters.length} size={25} />}>
      { requesters.map((requester,i)=>(
        <View key={requester.userId}>
          <View style={styles.resultRow}>
            <View style={styles.clientInfo} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: requester})}}>
              <ProfileImage user={requester} size={35}></ProfileImage>
              <Text style={{marginLeft:10, fontSize: 15}}>{requester.firstname} {requester.lastname}</Text>  
            </View>
            <Button title="Accept" onPress={()=>approveRequest(requester)} />
            <View style={styles.deleteButton} onTouchEnd={()=>deleteRequest(requester)}><Icon name="delete" size={25}></Icon></View>
          </View>
          { (i < requesters.length - 1) ? <View style={styles.divider} /> : null}
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

export default PartnerRequests;