import express from "express";
import { CreateSnitchRequest } from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import PushNotificationService from "../services/PushNotificationService";
import SnitchService from "../services/SnitchService";
import UserService from "../services/UserService";

const UserRouter = express();

UserRouter.post('/saveNotificationToken', async (req, res) => {
	let { userId, token } = req.body;
	await PushNotificationService.updateUserEndpoint(userId, token);
	res.status(200).send('good');
});

UserRouter.get('/search', async (req, res) => {
	let {
		query,
		page,
		pageSize
	} = req.query;

	console.log(req.query)

	const { users, total } = await new UserService().search(query, Number(pageSize), Number(page));
	res.status(200).send({ users, total });
});

export default UserRouter;