import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Colors from '../../assets/constants/colors';
import T from '../../assets/constants/text';
import Card from '../../components/Card';
import ProfileImage from '../../components/ProfileImage';
import { globalContext } from '../../navigation/appNavigator';

const TITLE = "Your Trainer"

const CurrentTrainer = observer(() => {
  const navigation = useNavigation<any>();
  const {currentUser, trainerStore} = useContext(globalContext);

  const trainer = trainerStore.data;
  
  if (trainerStore.loading) {
    return (
    <Card title={TITLE}>
      <ActivityIndicator color={Colors.red} size={30} />
    </Card>
    )
  }

  return (
    <Card title={TITLE}>
    { trainer ?
        <View style={styles.resultRow} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: trainer})}}>
          <ProfileImage user={trainer} size={30}></ProfileImage>
          <Text style={styles.text}>{trainer.firstname} {trainer.lastname}</Text>
        </View>
        :
          <Text style={styles.text}>{T.people.trainer.noTrainer}</Text>
      }
      </Card>
  );
});

const styles = StyleSheet.create({
  resultRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10, 
    fontSize: 15,
    color: Colors.white
  }
});

export default CurrentTrainer;