import UserService from "./UserService";
import * as admin from 'firebase-admin';
import { MessagingOptions, MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { DeviceToken } from "@prisma/client";

const { initializeApp } = require("firebase-admin/app");
initializeApp();

export const PresetOptions = {
	HighPriority: {
		// Required for background/quit data-only messages on iOS
		contentAvailable: true,
		// Required for background/quit data-only messages on Android
		priority: 'high',
	}
}

class PushNotificationService {

	async updateUserEndpoint(userId, token) {
		console.log('saveNotificationToken', token)
		await new UserService().addDeviceToken(userId, token);
	}

	async sendMessageToUsers(userIds:string[], message: MessagingPayload, options:MessagingOptions) {
		let tokens: DeviceToken[] = [] // TODO get tokens by user ids
		for (let id of userIds) {
			let userTokens = await new UserService().getUserTokens(id);
			console.log(id, userTokens)
			tokens.push(...userTokens);
		}
		if (!tokens.length) {
			console.log("Aborting notification send because no tokens were found.");
			return;
		}
		console.log(message)
		const res = await admin.messaging().sendToDevice(
			tokens.map(t => t.token), // tokens for all user devices
			message,
			options
		);
		console.log(res)
		return res;
	}

}

export default new PushNotificationService();