import React, { Component, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";


interface Props{
  title: string,
  footer?: ReactNode,
  children?: ReactNode
}

const PageSection: React.FC<Props> = ({title,footer,children}) => {
  return (
    <View
      style={styles.sectionWrapper}
    >
      <View style={styles.section}><Text style={styles.headerText}>{title}</Text></View>
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
