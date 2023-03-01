import { NativeModules, NativeEventEmitter, Platform, AppState, PermissionsAndroid } from "react-native";
import messaging from '@react-native-firebase/messaging';
import { request } from "./ServerFacade";
import notifee from '@notifee/react-native';

class PushNotificationService {
	isInitialized: boolean = false;

	async init(userId) {
		if (this.isInitialized) return;

		/*** Prepare Notifee for Creating Notifications ***/
		// Required for Android 33+
		PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		// Request permissions (required for iOS)
		await notifee.requestPermission();

		// Create a channel (required for Android)
		const channelId = await notifee.createChannel({
			id: 'default',
			name: 'Default Channel',
			
		});

		/*** Prepare to Handle Incoming Notifications ***/
		messaging().onMessage(this.handleRemoteMessage);

		/*** Setup Token For Pushing to this device ***/
		// Register the device with FCM
		await messaging().registerDeviceForRemoteMessages();
		const token = await messaging().getToken();
		console.log("Got FCM Token!", token);
		// Save the token
		try {
			request.post('user/saveNotificationToken', { userId, token })
		}
		catch (e) {
			console.log('Error saving user device token.', e)
		}
		this.isInitialized = true;
	}


	async handleRemoteMessage(remoteMessage) {
		console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
		notifee.displayNotification({
			title: remoteMessage.notification?.title,
			body: remoteMessage.notification?.body,
			android: {
				channelId: 'default',
				smallIcon: 'ic_notif',
				// pressAction is needed if you want the notification to open the app when pressed
				pressAction: {
					id: 'default',
				},
			},
		});
	}

}

export default new PushNotificationService();