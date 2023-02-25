import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import TrainerService from "../services/TrainerService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string>(event, async (clientId,res)=>{
        let clients = await new TrainerService().getClientsOfTrainer(clientId);
        res.setBodyToData(clients);
        res.setCode(200);
        return res;
    });
}