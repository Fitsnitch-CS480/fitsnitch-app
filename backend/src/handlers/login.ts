import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";
import { UserLoginRequest } from "../../../react-native-app/shared/models/requests/UserLoginRequest";
import User from "../../../react-native-app/shared/models/User";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<UserLoginRequest>(event, async (data, res)=>{
        let user:User|undefined = await new UserService().login(data);
        res.setBodyToData(user);
        res.setCode(200);
        return res;
    });
}