import RestaurantData from "../../../../react-native-app/shared/models/RestaurantData";
import CoordinateUtils from "../../utils/CoordinateUtils";
import PlacesApiAdapter, { RestaurantDetectionDetails } from "../PlacesApiAdapter";
import axios, { AxiosResponse } from 'axios';
import { LatLonPair, BoundingBox } from "../../../../react-native-app/shared/models/CoordinateModels";

type OverpassElement = {
    type: "way"|"node"|"relation";
    id: number;
    tags: {
        [key:string]:string,
    }
    lat: number;
    lon: number;
    nodes: number[];
}

/**
 * Adapter for getting places info from the OpenStreetMap Overpass API
 */


function getNameFromElement(el: OverpassElement) {
    return el.tags?.name || el.tags?.brand || "";
}

export default class OverpassAdapter implements PlacesApiAdapter {
    async getRestaurantsInRadius(coord:LatLonPair, radius:number): Promise<RestaurantDetectionDetails[]> {
        let bbox = CoordinateUtils.createBoxAroundCoord(coord,radius);
        let res: AxiosResponse<{elements:OverpassElement[]},null> = await this.sendQuery(this.buildRestaurantQuery(bbox));

        let way_nodes = new Map<number,OverpassElement>();
        let ways = new Map<number,OverpassElement>();
        let restaurants: RestaurantDetectionDetails[] = [];

        for (let el of res.data.elements as OverpassElement[]) {
            if (el.type === 'node') {
                if (el.tags && el.lat && el.lon) restaurants.push({
                    name: getNameFromElement(el),
                    pinLocation: new LatLonPair(el.lat, el.lon)
                })
                else way_nodes.set(el.id,el as OverpassElement)
            }
            else if (el.type = 'way') ways.set(el.id,el as OverpassElement)
        };

        for (let [id,way] of ways) {
            restaurants.push({
                name: getNameFromElement(way),
                boundary: way.nodes.reduce((arr,id)=> {
                    let node = way_nodes.get(id)
                    if (node) arr.push(new LatLonPair(node.lat, node.lon))
                    return arr;
                }, [] as LatLonPair[])
            })
        }
    
        return restaurants
    }

    private async sendQuery(query:string) {
        const baseUrl = "https://www.overpass-api.de/api/interpreter?";
        let params = new URLSearchParams();
        params.set("data",query);
        return await axios.post(baseUrl,params);
    }

    private createBboxFilter(bbox:BoundingBox) {
        return `[bbox:${bbox.south},${bbox.west},${bbox.north},${bbox.east}]`;
    }

    // the keyword at the beginning of the query tells which type of element you are looking for.
    // you can request 'node', 'way', 'relation', or 'nwr' for all three.
    private buildRestaurantQuery(bbox: BoundingBox) {
        // Example:
        // [out:json][bbox:40.248069,-111.66167,40.254069,-111.65567];(nwr[amenity=fast_food];>;nwr[amenity=restaurant];>;nwr[amenity=ice_cream];>;nwr[amenity=cafe];>;);out;
        let query = "[out:json]"
            + this.createBboxFilter(bbox)+";("
            + amenitiesQueries
            + ");out;"
        return query;
    }

}


/**
 * This list contains all food-related amenities that account for
 * > 0.01% of all OSM nodes with the amenity tag
 */
const food_amenities = [
    "bakery",
    "bar",
    "bistro",
    "cafe",
    "coffee_shop",
    "cuisine",
    "deli",
    "food",
    "fast_food",
    "food_court",
    "ice_cream",
    "juice_bar",
    "restaurant",
    "pub",
]

const amenitiesQueries = food_amenities.reduce((string,a)=>string+`nwr[amenity='${a}'];>;`, "")

