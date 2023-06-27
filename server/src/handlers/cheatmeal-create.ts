import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import CheatMealService from "../services/CheatMealService";
import { CreateCheatMealRequest } from "../../../react-native-app/shared/models/requests/CreateCheatMealRequest";
import CheatMealEvent from "../../../react-native-app/shared/models/CheatMealEvent";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<CheatMealEvent>(event, async (newCheatMealData, res)=>{
        try {
            await new CheatMealService().createCheatMeal(newCheatMealData);
            res.setBodyToData("Successfully created Cheat Meal!");
            res.setCode(200);
        }
        catch (e) {
            console.log("Error creating Cheat Meal:", e);
            res.setBodyToMessage("Could not create Cheat Meal. Looks like you'll starve :(");
            res.setCode(500);
        }
        return res;
    });
}