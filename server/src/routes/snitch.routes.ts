import express from "express";
import { CreateSnitchRequest } from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import SnitchService from "../services/SnitchService";

const SnitchRouter = express();

SnitchRouter.post('/publishNewSnitch', async (req, res, next) => {
	const newSnitchData = req.body as CreateSnitchRequest;
	try {
		await new SnitchService().createAndPublishSnitch(newSnitchData);
		res.status(200).send();
	}
	catch (e) {
		next(e);
	}
});

export default SnitchRouter;