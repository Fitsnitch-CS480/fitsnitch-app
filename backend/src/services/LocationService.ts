import { LatLonPair as LatLonPair } from "../../../react-native-app/shared/models/CoordinateModels";
import RestaurantData from "../../../react-native-app/shared/models/RestaurantData";
import OverpassAdapter from "../places_api/OverpassAdapter/OverpassAdapter";
import PlacesApiAdapter, { RestaurantDetectionDetails } from "../places_api/PlacesApiAdapter";
const relationToPoly = require('robust-point-in-polygon')

export class LocationService {
    /**
     * Loads all restaurants within a small radius of the given coords and
     * determines which one the coords are inside of or closest to.
     */
    public static async getRestaurantAtLocation(coord: LatLonPair): Promise<RestaurantData | null> {
        /** Radius about the distance from McD's to their farthest drive-thru menu  */
        const radius = 0.00015;
        let places = await this.getPlacesApiAdapter().getRestaurantsInRadius(coord,radius);
        if (places.length === 1) return places[0];

        if (places.length > 1) {
            let closestPlace: RestaurantDetectionDetails|null = null;
            let smallestDistance = Infinity;
            for (let place of places) {
                if (place.boundary) {
                    // If the user is within the boundaries of this place,
                    // return this place!
                    if (this.isInBoundary(place.boundary, coord)) return place;
                    // Otherewise, compute the pinLocation as the restaurant center
                    // if it doesn't exist yet
                    if (!place.pinLocation) {
                        let lat = place.boundary.reduce((sum,p)=>sum+p.lat, 0)/place.boundary.length;
                        let lon = place.boundary.reduce((sum,p)=>sum+p.lon, 0)/place.boundary.length;
                        place.pinLocation = new LatLonPair(lat,lon)
                    }
                }

                // If the plae has no boundaries, then the pinLocation is our only
                // way of fixing it to a particular coordinate
                if (place.pinLocation) {
                    let dist = this.distanceBetween(coord, place.pinLocation)
                    if (dist < smallestDistance) {
                        closestPlace = place;
                        smallestDistance = dist;
                    }
                }

            }

            if (closestPlace) return {
                name: closestPlace.name,
                location: closestPlace.pinLocation
            }
    
        }

        return null;
    }

    public static distanceBetween(p1: LatLonPair, p2: LatLonPair): number {
        let x1 = p1.lon
        let x2 = p2.lon
        let y1 = p1.lat
        let y2 = p1.lat
        return Math.sqrt( (x2-x1)**2 + (y2-y1)**2 )
    }

    public static isInBoundary(boundary: LatLonPair[], p: LatLonPair): boolean {
        let poly = boundary.map(pt=>[pt.lat,pt.lon])
        return relationToPoly(poly, [p.lat,p.lon]) === -1;
    }

    private static getPlacesApiAdapter(): PlacesApiAdapter {
        // consider using a configureable factory for better flexibility
        return new OverpassAdapter();
    }
}