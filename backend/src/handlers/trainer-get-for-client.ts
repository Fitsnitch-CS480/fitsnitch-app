import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import TrainerService from "../services/TrainerService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (clientId,res)=>{
        let trainer = await new TrainerService().getTrainerIdOfClient(clientId);
        res.setBodyToData(trainer);
        res.setCode(200);
        return res;
    });
}