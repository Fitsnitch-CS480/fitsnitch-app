import { LatLongPair } from "../../../shared/models/CoordinateModels";
import { LocationService } from "./LocationService";

describe(LocationService, ()=>{
    
    describe(LocationService.getRestaurantAtLocation, ()=>{
        /** This is very much an integration test using actual APIS!!! */
        it("should locate Domino's", async ()=>{
            let location = new LatLongPair(40.2508,-111.6613);
            let res = await LocationService.getRestaurantAtLocation(location);
            // console.log(res);
            expect(res).toBeDefined();
            expect(res?.name).toBe("Domino's");
        })
    })
})
