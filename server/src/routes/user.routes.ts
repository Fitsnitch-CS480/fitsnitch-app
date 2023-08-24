import express from "express";
import { CreateSnitchRequest } from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import PushNotificationService from "../services/PushNotificationService";
import SnitchService from "../services/SnitchService";
import UserService from "../services/UserService";
import { PendingUser } from "@prisma/client";
import { catchErrors } from "../utils/catchErrors";

const UserRouter = express();

UserRouter.post('/saveNotificationToken', async (req, res) => {
	let { userId, token } = req.body;
	await PushNotificationService.updateUserEndpoint(userId, token);
	res.status(200).send('good');
});

UserRouter.get('/search', catchErrors(async (req, res) => {
	let {
		query,
		page,
		pageSize
	} = req.query;

	const { users, total } = await UserService.search(query, Number(pageSize), Number(page));
	res.status(200).send({ users, total });
}));

UserRouter.post('/create-pending', catchErrors(async (req, res) => {
	const {
		pendingUserId,
		firstname,
		lastname,
		email,
		phone,
	} = req.body;

	const pendingUser = {
		pendingUserId,
		firstname,
		lastname,
		email,
		phone,
	} as PendingUser;

	console.log(req.body, pendingUser)

	await UserService.createPendingUser(pendingUser);
	res.status(200).send();
}));

UserRouter.post('/confirm-pending', catchErrors(async (req, res) => {
	const {
		pendingUserId,
	} = req.body;

	if (!pendingUserId) {
		return res.status(300).send({success: false, message: 'pendingUserId was not provided'});
	}
	const pendingUser = await UserService.getPendingUser(pendingUserId as string);
	if (!pendingUser) {
		return res.status(200).send({success: false, message: 'Could not find pending user'});
	}
	const user = await UserService.changePendingToUser(pendingUser);
	res.status(200).send({ success: true, message: 'Confirmed pending user', data: user });
}));

export default UserRouter;
