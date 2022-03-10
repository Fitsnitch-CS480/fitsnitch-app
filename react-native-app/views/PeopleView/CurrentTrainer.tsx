import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import ClientTrainerService from '../../backend/services/ClientTrainerService';
import PageSection from '../../components/PageSection';
import ProfileImage from '../../components/ProfileImage';
import { globalContext } from '../../navigation/appNavigator';
import User from '../../shared/models/User';

const TITLE = "Your Trainer"

const CurrentTrainer: React.FC = () => {
  const navigation = useNavigation();
  const [currentUser] = useContext(globalContext).currentUser;

  let [trainer, setTrainer] = useState<User|null>(null)
  let [loading, setLoading] = useState<boolean>(true)
  
  useEffect(()=>{
    new ClientTrainerService().getUserTrainer(currentUser.userId).then((trainer)=>{
      setTrainer(trainer)
      setLoading(false)
    });  
  }, [])


  
  if (loading) {
    return (
    <PageSection title={TITLE}>
      <ActivityIndicator color="0000ff"size={30} />
    </PageSection>
    )
  }

  return (
    <PageSection title={TITLE}>
    { trainer ?
        <View style={styles.resultRow} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: trainer})}}>
          <ProfileImage user={trainer} size={30}></ProfileImage>
          <Text style={{marginLeft:10, fontSize: 15}}>{trainer.firstname} {trainer.lastname}</Text>
        </View>
        :
          <Text>You don't have a trainer yet!</Text>
      }
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

export default CurrentTrainer;