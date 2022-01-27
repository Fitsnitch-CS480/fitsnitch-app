import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import TrainerService from "../services/TrainerService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (pair,res)=>{
        let trainerId:string = await new TrainerService().getTrainerIdOfClient(pair);
        res.setBodyToData(trainerId);
        res.setCode(200);
        return res;
    });
}