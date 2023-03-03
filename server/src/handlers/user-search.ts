import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";
import { UserSearchRequest } from "../../../react-native-app/shared/models/requests/UserSearchRequest";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<UserSearchRequest>(event, async (request,res)=>{
        let responsePage = await new UserService().search(request);
        if (responsePage) {
            res.setBodyToData(responsePage);
            res.setCode(200);
        }
        return res;
    });
}