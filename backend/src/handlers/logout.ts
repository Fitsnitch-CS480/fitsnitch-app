import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (username, res)=>{
        try {
            await new UserService().logout(username);
            res.setBodyToMessage("Successfully logged out!");
            res.setCode(200);
        }
        catch (e) {
            console.log("Error logging out: ", e);
            res.setBodyToMessage("Could not log out");
            res.setCode(500);
        }
        return res;
    });

}