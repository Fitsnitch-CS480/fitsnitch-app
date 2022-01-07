import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";


interface Props{
  placeholder: string;
  secureTextEntry?: boolean;
}

const MaterialUnderlineTextbox: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry || false}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center"
  },
  inputStyle: {
    color: "#000",
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 16,
    paddingBottom: 8
  }
});

export default MaterialUnderlineTextbox;
