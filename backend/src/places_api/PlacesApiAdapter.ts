import { LatLongPair } from "../../../react-native-app/shared/models/CoordinateModels";
import RestaurantData from "../../../react-native-app/shared/models/RestaurantData";

export default interface PlacesApiAdapter {
    /**
     * Finds restaurant places inside a bounding box. 
     * @param bbox
     */
    getRestaurantsInRadius(coord:LatLongPair, radius:number): Promise<RestaurantData[]>;
}