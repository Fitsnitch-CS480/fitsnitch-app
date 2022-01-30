import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerAssociationService from "../services/PartnerAssociationService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<PartnerAssociationPair>(event, async (pair,res)=>{
        try {
            await new PartnerAssociationService().requestPartnerAssociation(pair);
            res.setCode(200);
            return res;}
        catch(e) {
            console.log("Could not create partner request!",e)
            res.setBodyToMessage("Could not create partner request.").setCode(500)
            return res;
        }
        
    });
}