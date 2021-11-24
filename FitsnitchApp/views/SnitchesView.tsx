import React from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import ServerFacade from '../backend/ServerFacade';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
  // server: ServerFacade;
};

const SnitchesView: React.FC<Props> = ({
  name,
  // server,
}) => {
  // const [enthusiasmLevel, getUserLocation] = React.useState(
  //   server
  // );
  const server = new ServerFacade();

  const onSnitch = async () =>
    {
      if(await server.getUserLocation()){
        Alert.alert(
          'Attention',
          'This is a test!',
          [
              {text: 'cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
      )
      }
    }
  // getSnitchLocation(enthusiasmLevel + 1);
  // const onFalseAlarm = () =>
  //   setEnthusiasmLevel(
  //     enthusiasmLevel > 0 ? enthusiasmLevel - 1 : 0
  //   );

  // const getLocationCheck = (numChars: number) =>
  //   numChars > 0 ? Array(numChars + 1).join('!') : '';

  return (
    <View style={styles.container}>
      {/* This code remains as an example of using state and variables, but will be removed. */}
      <Text style={styles.greeting}>
        Snitching on {name||"User"}
        {server.getUserLocation()}
      </Text>
      <View>
        <Button
          title="Snitch"
          accessibilityLabel="snitch"
          onPress={onSnitch}
          color="blue"
        />
        {/* <Button
          title="False Alarm"
          accessibilityLabel="falseAlarm"
          onPress={onFalseAlarm}
          color="red"
        /> */}
      </View>
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

export default SnitchesView;