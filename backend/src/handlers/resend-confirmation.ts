import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (data, res)=>{
        try {
            await new UserService().resendConfirmation(data);
            res.setBodyToMessage("Successfully resent confirmation code!");
            res.setCode(200);
        }
        catch (e) {
            console.log("Error resending confirmation code: ", e);
            res.setBodyToMessage("Could not resend confirmation code");
            res.setCode(500);
        }
        return res;
    });
}