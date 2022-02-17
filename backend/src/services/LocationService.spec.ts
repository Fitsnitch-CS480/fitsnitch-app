import { LatLonPair } from "../../../react-native-app/shared/models/CoordinateModels";
import { LocationService } from "./LocationService";

describe(LocationService, ()=>{
    
    describe(LocationService.getRestaurantAtLocation, ()=>{
        jest.setTimeout(10000)

        /** This is very much an integration test using actual APIS!!! */
        it("should locate Domino's as only option", async ()=>{
            let location = new LatLonPair(40.25085, -111.6612840);
            let res = await LocationService.getRestaurantAtLocation(location);
            // console.log(res);
            expect(res).toBeDefined();
            expect(res?.name).toBe("Domino's");
        })

        it("should locate McDs from far drive-thru", async ()=>{
            /*
            ---------
            |       |
            |       |
            | McD's |
            |       |
            |       |
            ---------



                  *
            */
            let location = new LatLonPair(40.24982, -111.66243);
            let res = await LocationService.getRestaurantAtLocation(location);
            // console.log(res);
            expect(res).toBeDefined();
            expect(res?.name).toBe("McDonald's");
        })


        it("should locate Panda inside but near Pita", async ()=>{
            /*
            --------------------------
            |       |                |
            | Panda |      Pita      |
            |     * |                |
            |       |                |
            --------------------------
            */
            let location = new LatLonPair(40.25107, -111.6583);
            let res = await LocationService.getRestaurantAtLocation(location);
            // console.log(res);
            expect(res).toBeDefined();
            expect(res?.name).toBe("Panda Express");
        })

      
       
        it("should locate Pit inside but near Panda", async ()=>{
            /*
            --------------------------
            |       |                |
            | Panda |      Pita      |
            |       | *              |
            |       |                |
            --------------------------
            */
            let location = new LatLonPair(40.25107, -111.65826);
            let res = await LocationService.getRestaurantAtLocation(location);
            // console.log(res);
            expect(res).toBeDefined();
            expect(res?.name).toBe("Pita Pit");
        })

        
        it("should locate Panda outside but near pita", async ()=>{
            
            /*
            --------------------------
            |       |                |
            | Panda |      Pita      |
            |       |                |
            |       |                |
            --------------------------
                 *
            */
            let location = new LatLonPair(40.2510, -111.6583);
            let res = await LocationService.getRestaurantAtLocation(location);
            // console.log(res);
            expect(res).toBeDefined();
            expect(res?.name).toBe("Panda Express");
        })

        
        // it.only("should locate Pita outside but near Panda", async ()=>{
        
        //     // THIS EDGE CASE FAILS!!!
        //     // CASE: The user is not inside any known boundaries, is standing clearly
        //     // outside the front of one restaurant but in a way that is closer to the
        //     // geometric center of another.
            
        //     // Our algorithm does not determine the proximity to the walls of the
        //     // restaurants, so it can't pickk out these cases.
            
        //     // Solutions:
        //     //    1 - Minimize this case by only checking for restaurants when user
        //     //        is not moving
        //     //    2 - Reduce the query radius. This would simply the user need
        //     //        to step closer to the building to the building to detect
        //     //        either restaurant, but it wouldstill be possible for the
        //     //        use case to occur. It would also limit our ability to catch
        //     //        drive-thru visits.
        //     //    3 - Change the algorithm. Possible, but unclear how at this point.
        
        
        //     /*
        //     ----------------------------
        //     |       |                  |
        //     | Panda |        Pita      |
        //     |       |                  |
        //     |       |                  |
        //     ----------------------------
        //               *
        //     */
        //     let location = new LatLonPair(40.2510, -111.658275);
        //     let res = await LocationService.getRestaurantAtLocation(location);
        //     console.log(res);
        //     expect(res).toBeDefined();
        //     expect(res?.name).toBe("Pita Pit");
        // })


        it("should locate Pita outside but in range of Panda", async ()=>{
            /*
            --------------------------
            |       |                |
            | Panda |      Pita      |
            |       |                |
            |       |                |
            --------------------------
                            *
            */
            let location = new LatLonPair(40.2510, -111.65815);
            let res = await LocationService.getRestaurantAtLocation(location);
            // console.log(res);
            expect(res).toBeDefined();
            expect(res?.name).toBe("Pita Pit");
        })

    })
})
