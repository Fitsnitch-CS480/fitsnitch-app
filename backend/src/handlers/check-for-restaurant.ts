import LocationCheck from "../../../react-native-app/shared/models/LocationCheck";
import { LocationService } from "../services/LocationService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";

// TODO: Determine correct Request/Response models
export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<LocationCheck>(event, async (body,res)=>{
        let restaurant = await LocationService.getRestaurantAtLocation(body.location);
        if (restaurant) {
            res.setBodyToData(restaurant);
            res.setCode(200);
        }
        else {
            res.setBodyToMessage("User is not in a restricted restaurant.");
            res.setCode(404);
        }
        return res;
    });
}