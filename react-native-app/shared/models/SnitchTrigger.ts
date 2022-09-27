import { LatLonPair } from "./CoordinateModels";
import RestaurantData from "./RestaurantData";

export default class SnitchTrigger {
    constructor(
        public created: number, 
        public originCoords: LatLonPair,
        public restaurantData: RestaurantData,
    ) {}
}
