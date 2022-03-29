import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import PageSection from '../../components/PageSection';
import ProfileImage from '../../components/ProfileImage';
import { globalContext } from '../../navigation/appNavigator';

const TITLE = "Your Trainer"

const CurrentTrainer = observer(() => {
  const navigation = useNavigation<any>();
  const {currentUser, trainerStore} = useContext(globalContext);

  const trainer = trainerStore.data;
  
  if (trainerStore.loading) {
    return (
    <PageSection title={TITLE}>
      <ActivityIndicator color="#00bbff" size={30} />
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
});

const styles = StyleSheet.create({
  resultRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default CurrentTrainer;