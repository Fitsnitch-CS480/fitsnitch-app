import { LAT_MIN, LAT_MAX, LONG_MIN, LONG_MAX } from "../constants/CoordinateConstants";

export class LatLongPair {
    constructor(
        public lat: number,
        public long: number
    ) {
        if (lat < LAT_MIN || lat > LAT_MAX) {
            throw new Error(`Latitudes must be within ${LAT_MIN} and ${LAT_MAX}! Recieved: ${lat}`);
        }
        if (long < LONG_MIN || long > LONG_MAX) {
            throw new Error(`Longitudes must be within ${LONG_MIN} and ${LONG_MAX}! Recieved: ${long}`);
        }
    }
}

/**
 * A set of Lat/Long degress that enclose an area. Boundaries are inentified as North, East, South, and
 * West to avoid ambiguity when crossing axes.
 */
export class BoundingBox {
    constructor(
        public south: number,
        public west: number,
        public north: number,
        public east: number
    ) {
        // Quick boundary verification
        new LatLongPair(south,west);
        new LatLongPair(north,east);
    }
}
