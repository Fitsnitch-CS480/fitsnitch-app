import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import SnitchService from "../services/SnitchService";
import { CreateSnitchRequest } from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<CreateSnitchRequest>(event, async (newSnitchData,res)=>{
        try {
            await new SnitchService().createSnitch(newSnitchData)
            res.setBodyToData("Successfully created Snitch!");
            res.setCode(200);
        }
        catch (e) {
            console.log("Error creating Snitch:", e);
            res.setBodyToMessage("Could not create Snitch");
            res.setCode(500);
        }
        return res;
    });
}