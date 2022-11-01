import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from '../assets/constants/colors';

interface Props{
  title: string,
  headerRight?: ReactNode,
  footer?: ReactNode,
  children?: ReactNode
}

const PageSection: React.FC<Props> = ({title,headerRight,footer,children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <View style={[styles.headerWrapper, styles.section]}>
          <Text style={styles.headerText}>{title}</Text>
          {headerRight}
        </View>
        <View style={[styles.bodyWrapper, styles.section, styles.sectionWrapper]}>
          {children}
        </View>
        { footer && <View style={[styles.footerWrapper, styles.section]}>{footer}</View> }
      </View>
    </View>
  );
}

const spacing = 20

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    width: '100%',
  },
  sectionWrapper: {
    paddingLeft: spacing,
    paddingRight: spacing,
    paddingTop: spacing,
    width: '100%',
  },
  wrap: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 20,
  },
  section: {
    paddingBottom: spacing
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.darkRed,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white
  },
  bodyWrapper: {
  },
  footerWrapper: {
  },
});

export default PageSection;
