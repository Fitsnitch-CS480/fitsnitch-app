import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import TrainerService from "../services/TrainerService";
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import { TrainerClientPair } from "@prisma/client";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<TrainerClientPair>(event, async (pair,res)=>{
        let status:RelationshipStatus = await new TrainerService().getRelationshipStatus(pair);
        res.setBodyToData(status);
        res.setCode(200);
        return res;
    });
}