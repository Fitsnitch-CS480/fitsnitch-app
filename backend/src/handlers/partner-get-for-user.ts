import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import PartnerAssociationService from "../services/PartnerAssociationService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (pair,res)=>{
        let partnerId2:string = await new PartnerAssociationService().getPartner2IdOfPartner1(pair);
        res.setBodyToData(partnerId2);
        res.setCode(200);
        return res;
    });
}