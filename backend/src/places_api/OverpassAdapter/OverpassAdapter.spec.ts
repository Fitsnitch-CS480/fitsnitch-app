import { LatLongPair } from "../../../../react-native-app/shared/models/CoordinateModels";
import OverpassAdapter from "./OverpassAdapter"

describe(OverpassAdapter, ()=>{
    let adapter: OverpassAdapter = new OverpassAdapter();

    beforeEach(()=>{
        adapter = new OverpassAdapter();
    })

    /**
     * This is a terrible unit test, but an okay way of manually checking that the method works
     */
    describe(adapter.getRestaurantsInRadius, ()=>{
        it("should execute query", async ()=>{
            let res = await adapter.getRestaurantsInRadius(new LatLongPair(40.251069,-111.658670),.003);
            // console.debug(JSON.stringify(res,null,2));
        })
  
    })
})