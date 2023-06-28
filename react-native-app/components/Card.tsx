import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from '../assets/constants/colors';

interface Props{
  title: string,
  headerRight?: ReactNode,
  footer?: ReactNode,
  children?: ReactNode
}

const Card: React.FC<Props> = ({title,headerRight,footer,children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>{title}</Text>
          {headerRight}
        </View>
        <View style={[styles.bodyWrapper]}>
          {children}
        </View>
      </View>
    </View>
  );
}

const spacing = 10

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: '100%',
  },
  wrap: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
    borderBottomColor: Colors.border,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    color: Colors.white
  },
  bodyWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%',
  },
});

export default Card;
