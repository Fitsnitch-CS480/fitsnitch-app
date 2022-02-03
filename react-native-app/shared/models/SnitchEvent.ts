import { LatLongPair } from "./CoordinateModels";
import RestaurantData from "./RestaurantData";

export default class SnitchEvent {
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
         * THe exact location that triggered the snitch alert
         */
        public originCoords: LatLongPair,
        /**
         * Data about the restaurant that the user was determined to be inside of
         */
        public restaurantData: RestaurantData,
    ) {}
}
