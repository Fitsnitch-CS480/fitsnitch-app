import { LatLonPair } from "./CoordinateModels";
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
        public created_at: string, 
        /**
         * The exact location that triggered the snitch alert
         */
        public originCoords: LatLonPair,
        /**
         * Data about the restaurant that the user was determined to be inside of
         */
        public restaurantData: RestaurantData,
        /**
         * Primary Key
         */
        public snitchId?: string,
    ) {}
}
