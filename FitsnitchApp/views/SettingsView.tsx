import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const SettingsView: React.FC<Props> = ({
  name,
  baseEnthusiasmLevel = 0
}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Settings
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

export default SettingsView;