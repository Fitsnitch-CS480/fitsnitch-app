import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody(event, async (data, res)=>{
        let response = await new UserService().resendConfirmation();
        res.setBodyToData(response);
        res.setCode(200);
        return res;
    });
}