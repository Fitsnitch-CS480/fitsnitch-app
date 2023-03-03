import { LatLonPair } from "../../../react-native-app/shared/models/CoordinateModels";
import RestaurantData from "../../../react-native-app/shared/models/RestaurantData";

export default interface PlacesApiAdapter {
    /**
     * Finds restaurant places inside a bounding box. 
     * @param bbox
     */
    getRestaurantsInRadius(coord:LatLonPair, radius:number): Promise<RestaurantDetectionDetails[]>;
}

export type RestaurantDetectionDetails = {
    name: string,
    pinLocation?: LatLonPair,
    boundary?: LatLonPair[]
}