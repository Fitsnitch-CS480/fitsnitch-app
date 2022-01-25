import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';

export default function Popup({ popupShow, hidePopup, handleButton }: { popupShow: boolean, hidePopup: any, handleButton: any }) {

    return (
        <Modal isVisible={popupShow} onBackdropPress={hidePopup}>
        <View style={{backgroundColor:'#ffffff', marginVertical:50 ,marginHorizontal:10, padding:40, borderRadius:10, flex:1}}>
            <Text style= {{ fontSize: 40 }} >New Trip</Text>
            <View style={{justifyContent:'center', marginTop:50}}>
            </View>
            <View style={{marginTop:100}}>
            <Button title={"Enter"} onPress={handleButton}/>
            </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    cardHolder: {
      flex: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      marginHorizontal: '5%',
      backgroundColor: '#ffffff',
    },
    button: {
      position:'absolute',
      bottom:20,
      right:20,
      backgroundColor: '#F27612',
      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: 60,
      height: 60,
      justifyContent:'center',
      alignItems: 'center',
      borderWidth: 0,
    },
    text: {
      color: '#ffffff',
      fontSize: 32,
      height: 60,
      lineHeight: 50
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
    }
});  
