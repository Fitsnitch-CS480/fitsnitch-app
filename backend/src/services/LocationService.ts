import { LatLongPair } from "../../../shared/models/CoordinateModels";
import RestaurantData from "../../../shared/models/RestaurantData";
import OverpassAdapter from "../places_api/OverpassAdapter/OverpassAdapter";
import PlacesApiAdapter from "../places_api/PlacesApiAdapter";

export class LocationService {
    public static async getRestaurantAtLocation(coord: LatLongPair): Promise<RestaurantData | null> {
        /**
         * For the purposes of our demo, we will only check to see if
         * the given location is within a small radius of the pin for
         * the nearest restaurant.
         * 
         * Future algorithims may try to 
         * determine that size/boundaries of the restaurant to be 
         * more accurate.
         */
        const radius = 0.0002; // degree
        let places = await this.getPlacesApiAdapter().getRestaurantsInRadius(coord,radius);
        if (places.length === 1) return places[0];
        else return null;
    }


    private static getPlacesApiAdapter(): PlacesApiAdapter {
        // consider using a configureable factory for better flexibility
        return new OverpassAdapter();
    }
}