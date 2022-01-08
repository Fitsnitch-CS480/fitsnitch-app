import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";


interface Props{
  text: string;
}

const MaterialButtonPrimary: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.logIn}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  logIn: {
    color: "#fff",
    fontSize: 14
  }
});

export default MaterialButtonPrimary;
