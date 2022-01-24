import { LatLongPair } from "./CoordinateModels";

export default class LocationCheck {
    constructor(
        public userId: string, 
        public location: LatLongPair
    ) {};
}