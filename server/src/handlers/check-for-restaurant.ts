import LocationCheck from "../../../react-native-app/shared/models/LocationCheck";
import { LocationService } from "../services/LocationService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<LocationCheck>(event, async (body,res)=>{
        let restaurant = await LocationService.getRestaurantAtLocation(body.location);
		res.setBodyToData({ isRestaurant: Boolean(restaurant), restaurant });
		res.setCode(200);
        return res;
    });
}