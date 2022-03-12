import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import PartnerAssociationService from '../../backend/services/PartnerAssociationService';
import PageSection from '../../components/PageSection';
import ProfileImage from '../../components/ProfileImage';
import { globalContext } from '../../navigation/appNavigator';
import User from '../../shared/models/User';

const TITLE = "Your Partners"

const CurrentPartners: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentUser] = useContext(globalContext).currentUserState;

  let [partners, setPartners] = useState<User[]>([])
  
  useEffect(()=>{
    new PartnerAssociationService().getUserPartners(currentUser.userId).then((partners)=>{
      setPartners(partners)
    });  
  }, [])


  if (!partners) {
    return (
      <PageSection title={TITLE}>
        <ActivityIndicator color="0000ff" size={30} />
      </PageSection>
    )
  }

  return (
    <PageSection title={TITLE}>
      { partners.map((client,i)=>(
        <View key={client.userId}>
          <View style={styles.resultRow} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: client})}}>
            <ProfileImage user={client} size={30}></ProfileImage>
            <Text style={{marginLeft:10, fontSize: 15}}>{client.firstname} {client.lastname}</Text>  
          </View>
          { (i < partners.length - 1) ? <View style={styles.divider} /> : null}
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

export default CurrentPartners;