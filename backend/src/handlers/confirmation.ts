import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";
import { UserConfirmationRequest } from "../../../react-native-app/shared/models/requests/UserConfirmationRequest";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<UserConfirmationRequest>(event, async (data, res)=>{
        let response = await new UserService().confirmation(data);
        res.setBodyToData(response);
        res.setCode(200);
        return res;
    });
}