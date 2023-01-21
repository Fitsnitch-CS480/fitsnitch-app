import { LatLonPair } from "./CoordinateModels";
import RestaurantData from "./RestaurantData";


export default class CheatMealEvent {
    constructor(
        /**
         * Partition Key
         */
        public userId: string,
        /**
         * Sort Key
         * 
         * ISO Format for sorting in database YYYY-MM-DDThh:mm:ss.msZ
         */
        public created: string,
        /**
         * The exact location that Cheat Meal was used
         */
        public originCoords: LatLonPair,
        /**
         * Data about the restaurant that the user was in
         */
        public restaurantData: RestaurantData,
    ) {}
}