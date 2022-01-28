import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const PeopleView: React.FC<Props> = ({
  name,
  baseEnthusiasmLevel = 0
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Search" onPress={()=>{navigation.navigate("Search")}}></Button>
      <Text style={styles.greeting}>
        People
      </Text>
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