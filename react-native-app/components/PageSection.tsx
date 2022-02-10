import React, { Component, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";


interface Props{
  title: string,
  headerRight?: ReactNode,
  footer?: ReactNode,
  children?: ReactNode
}

const PageSection: React.FC<Props> = ({title,headerRight,footer,children}) => {
  return (
    <View
      style={styles.sectionWrapper}
    >
      <View style={[styles.headerWrapper, styles.section]}>
        <Text style={styles.headerText}>{title}</Text>
        {headerRight}
      </View>
      <View style={[styles.bodyWrapper, styles.section]}>
        {children}
      </View>
      <View style={[styles.footerWrapper, styles.section]}>{footer}</View>
    </View>
  );
}

const spacing = 20

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: spacing,
    paddingRight: spacing,
    paddingTop: spacing,
    width: '100%' 
  },
  section: {
    paddingBottom: spacing
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bodyWrapper: {
  },
  footerWrapper: {
  },
});

export default PageSection;
