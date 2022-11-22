import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Card from '../../reusable-components/Card';
import ProfileImage from '../../reusable-components/ProfileImage';
import { globalContext } from '../../views/appNavigator';

const TITLE = "Your Partners"

const CurrentPartners = observer(() => {
  const navigation = useNavigation<any>();

  const {currentUser, partnerStore} = useContext(globalContext);

  const partners = partnerStore.data;

  if (partnerStore.loading) {
    return (
      <Card title={TITLE}>
        <ActivityIndicator color="#00bbff" size={30} />
      </Card>
    )
  }

  if (partners.length === 0) {
    return (
      <Card title={TITLE}>
        <Text>You have no partners yet!</Text>
      </Card>
    )
  }

  return (
    <Card title={TITLE}>
      { partners.map((client,i)=>(
        <View key={client.userId}>
          <View style={styles.resultRow} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: client})}}>
            <ProfileImage user={client} size={30}></ProfileImage>
            <Text style={{marginLeft:10, fontSize: 15}}>{client.firstname} {client.lastname}</Text>  
          </View>
          { (i < partners.length - 1) ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </Card>
  );
});
export default CurrentPartners;


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
