import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import PartnerAssociationService from "../services/PartnerAssociationService";
import User from "../../../react-native-app/shared/models/User";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (userId,res)=>{
        try {
            let requesters:User[] = await new PartnerAssociationService().getRequestersByRequestee(userId);
            res.setCode(200);
            res.setBodyToData(requesters)
            return res;}
        catch(e) {
            console.log("Could not get partner requests!",e)
            res.setBodyToMessage("Could not get partner requests.").setCode(500)
            return res;
        }
    });
}