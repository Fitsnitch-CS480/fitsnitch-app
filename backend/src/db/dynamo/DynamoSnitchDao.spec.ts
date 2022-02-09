import { GetSnitchRequest } from "../../../../react-native-app/shared/models/requests/GetSnitchRequest";
import { UserSnitchesRequest } from "../../../../react-native-app/shared/models/requests/UserSnitchesRequest";
import SnitchEvent from "../../../../react-native-app/shared/models/SnitchEvent";
import DynamoSnitchDao from "./DynamoSnitchDao";

describe(DynamoSnitchDao, ()=>{

    /**
     * THESE ARE EXTREMELY FRAGILE TESTS
     * 
     * They do not use mocks and modify the LIVE Database. They were created
     * to prove that the methods work during development.
     * 
     * They require valid credentials to be in the environment.
     * 
     * Don't use them.
     */

    let dao: DynamoSnitchDao = new DynamoSnitchDao();
    let user1Id = "testUser1";
    let created1 = "2022-01-05T5:30:00"

    function generateFakeSnitch(userId,created) {
        return new SnitchEvent(userId,created,{lat:0,long:0},{name:"Wendy's",location:{lat:0,long:0}})
    }

    beforeEach(()=>{
        dao = new DynamoSnitchDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })


    describe(dao.getSnitchesForUsers, ()=>{
        // it("should get snitches", async ()=>{
        //     let request = new UserSnitchesRequest(["testUser2", "testUser5"], 10)
        //     let response = await dao.getSnitchesForUsers(request)
        //     console.log(response)
        // })
        
        // it("should get multiple pages", async ()=>{
        //     let request = new UserSnitchesRequest(["testUser2", "testUser5"], 3)
        //     let response = await dao.getSnitchesForUsers(request)
        //     console.log(response)

        //     expect(response.records).toMatchObject([
        //         { created: '2022-02-02T13:00:00', userId: 'testUser2' },
        //         { created: '2022-02-02T12:00:00', userId: 'testUser2' },
        //         { created: '2022-02-02T11:00:00', userId: 'testUser5' }
        //     ])
        //     expect(response.pageBreakKey).toBe(JSON.stringify(response.records[response.records.length-1]))

        //     request.pageBreakKey = response.pageBreakKey;
        //     response = await dao.getSnitchesForUsers(request)
        //     console.log(response)

        //     // notice that this case specifies a page break between two snitches with the
        //     // same created time

        //     expect(response.records).toMatchObject([
        //         { created: '2022-02-02T11:00:00', userId: 'testUser2' }
        //     ])
        //     expect(response.pageBreakKey).not.toBeDefined();
        // })

        
        // it("should get snitches for just one user", async ()=>{
        //     let spy = jest.spyOn(dao, "getUserSnitches")
        //     let request = new UserSnitchesRequest(["testUser2"], 10)
        //     let response = await dao.getSnitchesForUsers(request)
        //     console.log(response)
        //     expect(spy).toHaveBeenCalled()
        // })
        
    })

    

    // describe("CRUD", ()=>{
    //     it("perform all crud actions", async ()=>{
    //         // CREATE and READ

    //         let snitch = generateFakeSnitch(user1Id, created1)
    //         await dao.createSnitch(snitch);
    //         let resSnitch = await dao.getSnitch(new GetSnitchRequest(snitch.userId,snitch.created));

    //         expect(resSnitch).toMatchObject(snitch)
    //         console.log(resSnitch);

    //         // UPDATE
    //         snitch.restaurantData.name = "Domino's"
    //         await dao.updateSnitch(snitch);

    //         resSnitch = await dao.getSnitch(new GetSnitchRequest(snitch.userId,snitch.created));
    //         expect(resSnitch).toMatchObject(snitch)
    //         console.log(resSnitch);

    //         // DELETE
    //         await dao.deleteSnitch(snitch);
    //         resSnitch = await dao.getSnitch(new GetSnitchRequest(snitch.userId,snitch.created));
    //         expect(resSnitch).toBeNull();
    //         console.log(resSnitch);
    //     })
    // })

})
