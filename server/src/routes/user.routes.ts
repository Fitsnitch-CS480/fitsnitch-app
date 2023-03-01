import express from "express";
import { CreateSnitchRequest } from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import PushNotificationService from "../services/PushNotificationService";
import SnitchService from "../services/SnitchService";

const UserRouter = express();

UserRouter.post('/saveNotificationToken', (req, res) => {
	let { userId, token } = req.body;
	console.log({ userId, token })

	PushNotificationService.updateUserEndpoint(userId, token);
	res.status(200).send('good');
});

export default UserRouter;