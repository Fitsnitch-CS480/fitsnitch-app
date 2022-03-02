import CheatMealEvent from "../../../react-native-app/shared/models/CheatMealEvent";
import { CreateCheatMealRequest } from "../../../react-native-app/shared/models/requests/CreateCheatMealRequest";
import { GetCheatMealRequest } from "../../../react-native-app/shared/models/requests/GetCheatMealRequest";
import { UserCheatMealRequest, UserCheatMealResponse } from "../../../react-native-app/shared/models/requests/UserCheatMealRequest";
import DaoFactory from "../db/DaoFactory";


export default class CheatMealService {
    async createCheatMeal(data: CreateCheatMealRequest): Promise<CheatMealEvent> {
        let cheatMeal = new CheatMealEvent(data.userId, new Date().toISOString(), data.originCoords, data.restaurantData)
        await DaoFactory.getCheatMealDao().createCheatMeal(cheatMeal);
        return cheatMeal;
    }

    async updateCheatMeal(data: CheatMealEvent) {
        await DaoFactory.getCheatMealDao().updateCheatMeal(data);
    }

    async getCheatMeal(request: GetCheatMealRequest): Promise<CheatMealEvent|null> {
        return await DaoFactory.getCheatMealDao().getCheatMeal(request);
    }

    async getUserCheatMeals(request: UserCheatMealRequest): Promise<UserCheatMealResponse> {
        return await DaoFactory.getCheatMealDao().getUserCheatMeals(request);
    }

    async deleteCheatMeal(data: CheatMealEvent) {
        await DaoFactory.getCheatMealDao().deleteCheatMeal(data);
    }
}