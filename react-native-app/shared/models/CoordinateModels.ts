import { LAT_MIN, LAT_MAX, LONG_MIN, LONG_MAX } from "../constants/CoordinateConstants";

export class LatLonPair {
    constructor(
        public lat: number,
        public lon: number
    ) {
        if (lat < LAT_MIN || lat > LAT_MAX) {
            throw new Error(`Latitudes must be within ${LAT_MIN} and ${LAT_MAX}! Recieved: ${lat}`);
        }
        if (lon < LONG_MIN || lon > LONG_MAX) {
            throw new Error(`Longitudes must be within ${LONG_MIN} and ${LONG_MAX}! Recieved: ${lon}`);
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
        new LatLonPair(south,west);
        new LatLonPair(north,east);
    }
}
