import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CurrentTrainer from './CurrentTrainer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CurrentClients from './CurrentClients';
import TrainerRequests from './TrainerRequests';
import PartnerRequests from './PartnerRequests';
import CurrentPartners from './CurrentPartners';
import T from '../../assets/constants/text';
import Colors from '../../assets/constants/colors';

const PeopleView: React.FC = ({
}) => {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{T.people.title}</Text>
        <View style={styles.searchIconWrapper}
          onTouchEnd={()=>navigation.navigate("Search")}>
            <Icon name="search" style={styles.icon} size={30}/>
        </View>
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
  screen: {
    backgroundColor: Colors.background
  },
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
    margin: 16,
    color: Colors.white
  },
  icon: {
    color: Colors.white
  }
});

export default PeopleView;