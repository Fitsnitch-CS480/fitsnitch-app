import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import Colors from "../assets/constants/colors";
import MatIcon from "./MatIcon";
import { MatIconName } from "./MatIconName";

interface Props {
  children?: ReactNode,
  icon?: MatIconName,
  primary?: boolean, 
  secondary?: boolean,
  color?: string,
  textColor?: string,
  outline?: boolean,
  size?: number,
  title?: string,
  onPress?: ()=>void,
  loading?: boolean,
  shadow?: boolean,
  style?: any
}

const MatButton: React.FC<Props> = (props) => {
  const TEXT_COLOR = props.textColor ||  Colors.white;
  const BORDER_COLOR = props.textColor ||  Colors.darkRed;
  const BG_COLOR = props.color || (props.secondary ? Colors.darkRed : Colors.background);
  const SIZE = props.size || 14;
  const SHADOW = props.shadow ?? true;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: BG_COLOR,
      height: SIZE * 2.25,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      borderWidth: (props.outline || props.secondary) ? StyleSheet.hairlineWidth : 0,
      borderColor: BORDER_COLOR,
      borderRadius: 5,
      paddingHorizontal: SIZE *.8,
      ... (!SHADOW ? {} : {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 2,
      }),
    },
    text: {
      color: TEXT_COLOR,
      fontSize: SIZE
    }
  });

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      { props.loading ? 
        <ActivityIndicator size={SIZE * 1.25} color={TEXT_COLOR} />
      :
        props.children ? props.children
      :
        <>
          { props.icon && <MatIcon name={props.icon} size={SIZE * 1.25} color={TEXT_COLOR} /> }
          { props.icon && props.title && <View style={{width: SIZE * .5}} /> }
          { props.title && <Text style={styles.text}>{props.title}</Text> }      
        </>}
      </TouchableOpacity>
  );
}

export default MatButton;
