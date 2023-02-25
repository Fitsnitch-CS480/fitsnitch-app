import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import CheatMealService from "../services/CheatMealService";
import { GetCheatMealRequest } from "../../../react-native-app/shared/models/requests/GetCheatMealRequest";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<GetCheatMealRequest>(event, async (request, res)=>{
        try {
            let page = await new CheatMealService().getCheatMeals(request);
            res.setBodyToData(page);
            res.setCode(200);
        }
        catch (e) {
            console.log("Error getting cheat meals:", e);
            res.setBodyToMessage("Could not get cheat meals");
            res.setCode(500);
        }
        return res;
    });
}