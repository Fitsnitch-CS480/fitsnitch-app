import CheatMealEvent from "../../../react-native-app/shared/models/CheatMealEvent";
import { GetCheatMealRequest } from "../../../react-native-app/shared/models/requests/GetCheatMealRequest";
import { UserCheatMealRequest, UserCheatMealResponse } from "../../../react-native-app/shared/models/requests/UserCheatMealRequest";


export default interface CheatMealDao {
    createCheatMeal(data: CheatMealEvent)
    getCheatMeal(request: GetCheatMealRequest): Promise<CheatMealEvent|null>
    getCheatMeals(request: GetCheatMealRequest): Promise<CheatMealEvent[]|null>
    getUserCheatMeals(request: UserCheatMealRequest): Promise<UserCheatMealResponse>
    updateCheatMeal(data: CheatMealEvent)
    deleteCheatMeal(data: CheatMealEvent)
}