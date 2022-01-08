import { LAT_MIN, LAT_MAX, LONG_MAX } from "../../../shared/constants/CoordinateConstants";
import { LatLongPair, BoundingBox } from "../../../shared/models/CoordinateModels";
import { SafeMath } from "./SafeMath";

export default class CoordinateUtils {
    
    /**
     * Returns the latitude of `lat` shifted North/South by `delta`. Direction is determined by sign.
     * 
     * Currently, any shift is capped by +/- 90, because correct behavior around poles is uncertain.
     * 
     * This method does not handle an entire coordinate,
     * so it cannot determine where to place the longitude if the latitude were to pass over the North
     * Pole (ie, 89 + 2 => 91 => 89 on the OPPOSITE side of the globe.)
     * 
     * 
     * @param lat The original latitude
     * @param delta How many degrees to shift the latitude in which direction
     */
    public static shiftLatitude(lat:number,delta:number): number {
        let newLat = SafeMath.add(lat,delta);
        // south pole
        if (newLat < LAT_MIN) {
            return LAT_MIN;
        }
        // north pole
        else if (newLat > LAT_MAX) {
            return LAT_MAX;
        }
        return newLat;
    }

    /**
     * Returns the longitude of `long` shifted East/West by `delta`. Result is normalized between
     * -180 and 180.
     * 
     * Postiive `delta` = Shift eastward.
     * Negative `delta` = Shift westward.
     * 
     * @param long Original longitude
     * @param delta How many degrees to shift longitude in which direction.
     * @returns Resulting longitude normalized between -180 and 180.
     */
    public static shiftLongitude(long:number,delta:number): number {
        let newLong = SafeMath.add(long,delta);

        // Find equivalent Longitude within accepted range
        let absLong = Math.abs(newLong);
        if (absLong > LONG_MAX) {
            // Get the same coordinate from the other direction. ie, 185 => 175
            let modLong = SafeMath.subtract(SafeMath.multiply(2,LONG_MAX),absLong);
            // If shift moved value above 180, modlong needs to be negative. 
            if (newLong > 0) {
                modLong = SafeMath.multiply(modLong,-1);
            }
            newLong = modLong;
        }

        return newLong;
    }

    /**
     * Creates a `BoundingBox` centered on `coord` with `radius` as radius.
     * 
     * @param coord Original coordinates
     * @param radius Degrees to extend the box in each compass direction
     */
    public static createBoxAroundCoord(coord:LatLongPair, radius: number) {
        let south = CoordinateUtils.shiftLatitude(coord.lat,-radius);
        let north = CoordinateUtils.shiftLatitude(coord.lat,radius);
        let west = CoordinateUtils.shiftLongitude(coord.long,-radius);
        let east = CoordinateUtils.shiftLongitude(coord.long,radius);

        return new BoundingBox(south,west,north,east);
    }
   
}

