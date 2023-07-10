import { LatLonPair } from "./CoordinateModels";
import RestaurantData from "./RestaurantData";

export default class SnitchTrigger {
    constructor(
        public created_at: number, 
        public originCoords: LatLonPair,
        public restaurantData: RestaurantData,
    ) {}
}
