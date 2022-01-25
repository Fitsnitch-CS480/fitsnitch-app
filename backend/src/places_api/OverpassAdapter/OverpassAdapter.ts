import RestaurantData from "../../../../react-native-app/shared/models/RestaurantData";
import CoordinateUtils from "../../utils/CoordinateUtils";
import PlacesApiAdapter from "../PlacesApiAdapter";
import axios, { AxiosResponse } from 'axios';
import { LatLongPair, BoundingBox } from "../../../../react-native-app/shared/models/CoordinateModels";

const food_amenities = [
    "fast_food",
    "restaurant",
    "ice_cream",
    "cafe",
]

class OverpassElement {
    type!: "way"|"node"|"relation";
    id!: number;
    tags?: {
        [key:string]:string,
    }
}

class OverpassNode extends OverpassElement {
    lat!: number;
    lon!: number;
}

class OverpassWay extends OverpassElement {
    nodes!: number[];
}


/**
 * Adapter for getting places info from the OpenStreetMap Overpass API
 */
// TODO: This adapter currently only queries for "NODE" type map elements, but many restaurants
// are defined as "WAY" types. WAY types do not have lat/long coords but rather have a list of
// NODE element IDs that create a fence around an area. In order to get location data for a WAY
// it is necessary to also query one or all of the nodes.

export default class OverpassAdapter implements PlacesApiAdapter {
    async getRestaurantsInRadius(coord:LatLongPair, radius:number): Promise<RestaurantData[]> {
        // TODO: query Overpass for restaurants
        let bbox = CoordinateUtils.createBoxAroundCoord(coord,radius);
        let res: AxiosResponse<{elements:OverpassNode[]},null> = await this.sendQuery(this.buildRestaurantQuery(bbox));
        return res.data.elements.map((el)=>this.nodeToRestaurantData(el))
    }

    private async sendQuery(query:string) {
        const baseUrl = "https://www.overpass-api.de/api/interpreter?";
        return await axios.get(baseUrl+query);
    }

    private createBboxFilter(bbox:BoundingBox) {
        return `(${bbox.south},${bbox.west},${bbox.north},${bbox.east})`;
    }

    // the keyword at the beginning of the query tells which type of element you are looking for.
    // you can request 'node', 'way', 'relation', or 'nwr' for all three.
    private buildRestaurantQuery(bbox: BoundingBox) {
        let query = "[out:json];(";
        for (let value of food_amenities) {
            query += `node${this.createBboxFilter(bbox)}[amenity=${value}];`;
        }
        query += ");out;"
        return query;
    }

    private nodeToRestaurantData(el: OverpassNode): RestaurantData {
        let name = el.tags?.name || el.tags?.brand;
        let location = new LatLongPair(el.lat,el.lon);
        return {name,location}
    }
    

}

