import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (userId,res)=>{
        let user = await new UserService().getUser(userId);
		console.log(userId)
        if (user) {
            res.setBodyToData(user);
            res.setCode(200);
        }
        else {
            res.setBodyToMessage("Could not locate user "+userId);
            res.setCode(404);
        }
        return res;
    });
}