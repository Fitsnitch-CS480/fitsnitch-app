import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PageSection from '../../components/PageSection';
import CurrentTrainer from './CurrentTrainer';

export type Props = {
};

const PeopleView: React.FC<Props> = ({
}) => {
  const navigation = useNavigation();

  

  useEffect(()=>{
    console.log("effected people view!")
  })


  return (
    <View style={styles.container}>
      <Button title="Search" onPress={()=>{navigation.navigate("Search")}}></Button>
      <Text style={styles.greeting}>
        People
      </Text>
        <CurrentTrainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16
  }
});

export default PeopleView;