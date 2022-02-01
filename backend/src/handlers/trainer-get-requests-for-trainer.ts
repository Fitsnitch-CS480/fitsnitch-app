import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import TrainerService from "../services/TrainerService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (trainerId,res)=>{
        let requesters = await new TrainerService().getRequestsByTrainer(trainerId);
        res.setBodyToData(requesters);
        res.setCode(200);
        return res;
    });
}