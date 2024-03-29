import React from 'react';
import { Text, StyleSheet, TouchableHighlight } from 'react-native';
import Colors from '../assets/constants/colors';

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    backgroundColor: Colors.lightBlue,
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
  },
  textStyle: {
    fontSize: 18,
    color: 'white',
  },
});

type props = {
	onPress?,
	children?,
	backgroundColor?
};

const Button = ({ onPress, children, backgroundColor }: props) => {
  const btnStyle = backgroundColor ? [styles.buttonStyle, { backgroundColor }] : styles.buttonStyle;
  return (
    <TouchableHighlight
      onPress={onPress}
      style={btnStyle}
    >
      <Text style={styles.textStyle}>
        {children}
      </Text>
    </TouchableHighlight>
  );
};

export default Button;