import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";
import { UserSignUpRequest } from "../../../react-native-app/shared/models/requests/UserSignUpRequest";
import User from "../../../react-native-app/shared/models/User";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<UserSignUpRequest>(event, async (data, res)=>{
        let user:any = await new UserService().signUp(data);
        res.setBodyToData(user);
        res.setCode(200);
        return res;
    });
}