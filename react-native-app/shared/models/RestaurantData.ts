import { LatLonPair } from "./CoordinateModels";

// TODO - should this be an object (class) instead of a Type?
type RestaurantData = {
    name?: string,
    location?: LatLonPair
}

export default RestaurantData;