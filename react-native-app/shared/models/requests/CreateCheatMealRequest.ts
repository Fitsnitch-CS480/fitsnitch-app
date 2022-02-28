import { LatLonPair } from "../CoordinateModels";
import RestaurantData from "../RestaurantData";


export class CreateCheatMealRequest {
    constructor(
        public userId:string,
        public restaurantData:RestaurantData,
        public originCoords:LatLonPair
    ) {}
}