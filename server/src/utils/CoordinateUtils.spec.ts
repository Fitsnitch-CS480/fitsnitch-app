import { LatLonPair, BoundingBox } from "../../../react-native-app/shared/models/CoordinateModels";
import CoordinateUtils from "./CoordinateUtils";

describe(CoordinateUtils, ()=>{
    
    describe(CoordinateUtils.createBoxAroundCoord, ()=>{
        describe("should handle valid inputs correctly",()=>{
            let validCases = [
                {coord: new LatLonPair(0,0), radius: 1, result: new BoundingBox(-1,-1,1,1)},
                {coord: new LatLonPair(40.2499,-111.6582), radius: 0.0002, result: new BoundingBox(40.2497,-111.6584,40.2501,-111.6580)}
            ]
            
            for (let c of validCases) {
                it("Case: "+JSON.stringify(c), async ()=>{
                    expect(CoordinateUtils.createBoxAroundCoord(c.coord, c.radius)).toMatchObject(c.result);
                })
            }
        })
    })
})
