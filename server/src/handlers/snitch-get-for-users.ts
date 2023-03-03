import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import { UserSnitchesRequest } from "../../../react-native-app/shared/models/requests/UserSnitchesRequest";
import SnitchService from "../services/SnitchService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<UserSnitchesRequest>(event, async (request,res)=>{
        try {
            let page = await new SnitchService().getUserSnitches(request)
            res.setBodyToData(page);
            res.setCode(200);
        }
        catch (e) {
            console.log("Error getting snitches:", e);
            res.setBodyToMessage("Could not get snitches");
            res.setCode(500);
        }
        return res;
    });
}