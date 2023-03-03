import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import PartnerAssociationService from "../services/PartnerAssociationService";
import User from "../../../react-native-app/shared/models/User";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (userId,res)=>{
        let partners:User[] = await new PartnerAssociationService().getPartnersOfUser(userId);
        res.setBodyToData(partners);
        res.setCode(200);
        return res;
    });
}