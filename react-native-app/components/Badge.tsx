import { observer } from "mobx-react-lite";
import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";


interface Props{
  qty: number;
  color?: string;
  size?: number;
  onPress?: ()=>void;
}

const Badge = observer<Props>(({qty,color,size=20,onPress}) => {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      display: 'flex',
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: color || 'red',
      borderRadius: size,
    },
    text: {
      color: "#fff",
      fontSize: size*.7,
      fontWeight: 'bold'
    }
  });
  
  return (
    <View style={styles.container} onTouchEnd={onPress}>
      <Text style={styles.text}>
        {qty > 9 ? '9+' : qty}
      </Text>
    </View>
  );
})

export default Badge;
