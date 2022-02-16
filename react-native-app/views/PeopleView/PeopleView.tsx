import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import CurrentTrainer from './CurrentTrainer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CurrentClients from './CurrentClients';
import TrainerRequests from './TrainerRequests';
import PartnerRequests from './PartnerRequests';
import CurrentPartners from './CurrentPartners';


export type Props = {
};

const PeopleView: React.FC<Props> = ({
}) => {
  const navigation = useNavigation();

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>People</Text>
        <View style={styles.searchIconWrapper} onTouchEnd={()=>navigation.navigate("Search")}><Icon name="search" size={30} /></View>
      </View>
      
      <TrainerRequests />
      <PartnerRequests />

      <CurrentTrainer />
      <CurrentClients />
      <CurrentPartners />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchIconWrapper: {
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16
  }
});

export default PeopleView;