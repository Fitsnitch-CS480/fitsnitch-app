import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Share from 'react-native-share';
import base64ImagesData from '../utils/base64';

function SocialShareBtn(props: any) {
    const shareSingleImage = async () => {
        const shareOptions = {
            title: 'Snitch Alert! Someone is cheating on their mealplan!',
            message: 'Snitch Alert! Someone is cheating on their mealplan!',
            url: base64ImagesData.snitchAlert,
            failOnCancel: false,
        };
        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log('Share Response: ', ShareResponse);
        } catch (error) {
            console.log('Error =>', error);
        }
    };

    return (
        <View style={styles.button}>
            <Button onPress={shareSingleImage} title="Post a Snitch" />
        </View>
    );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
  }
});

export default SocialShareBtn;