import { LatLonPair } from "../CoordinateModels";
import RestaurantData from "../RestaurantData";


export class SwitchSnitchToCheatmealRequest {
    constructor(
        public userId:string,
        public created: string,
        public restaurantData:RestaurantData,
        public originCoords:LatLonPair
    ) {}
}