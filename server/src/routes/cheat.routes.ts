import express from "express";
import { GetCheatMealRequest } from "../../../react-native-app/shared/models/requests/GetCheatMealRequest";
import CheatMealService from "../services/CheatMealService";
import UserService from "../services/UserService";
import dayjs, { OpUnitType } from 'dayjs'
import { CreateCheatMealRequest } from "../../../react-native-app/shared/models/requests/CreateCheatMealRequest";
import CheatMealEvent from "../../../react-native-app/shared/models/CheatMealEvent";

const CheatRouter = express();

CheatRouter.get('/summary/:userId', async (req, res, next) => {
	const { userId } = req.params;
	try {
		let data;
		const user = await new UserService().getUser(userId);
		if (!user) throw new Error('No user by that ID');
		if (!user.cheatmealSchedule) {
			data = {
				schedule: null,
				used: 0,
				remaining: 0
			}
			return res.status(200).send({data});
		}
		const [period, qtyAllowed] = user.cheatmealSchedule.split('_');
		const startOfPeriod = dayjs().startOf(period as OpUnitType);
		const cheats = await new CheatMealService().getCheatMeals(new GetCheatMealRequest(userId, startOfPeriod.toISOString()));
		const used = cheats?.length || 0;

		data = {
			schedule: user.cheatmealSchedule,
			used,
			remaining: Number(qtyAllowed) - used,
		}

		res.status(200).send({data});
	}
	catch (e) {
		next(e);
	}
});


CheatRouter.post('/createCheatMeal', async (req, res, next) => {
	const cheatMeal = req.body as CheatMealEvent;
	try {
		await new CheatMealService().createCheatMeal(cheatMeal);
		res.status(200).send({});
	}
	catch (e) {
		next(e);
	}
});

export default CheatRouter;