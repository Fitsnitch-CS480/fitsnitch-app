import PartnerStatusResponse from './../../../react-native-app/shared/models/requests/PartnerStatusResponse';
import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerAssociationService from "../services/PartnerAssociationService";
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<PartnerAssociationPair>(event, async (pair,res)=>{
        let status:PartnerStatusResponse = await new PartnerAssociationService().getRelationshipStatus(pair);
        res.setBodyToData(status);
        res.setCode(200);
        return res;
    });
}