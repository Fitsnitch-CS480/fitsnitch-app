import DynamoTrainersDao from "./DynamoTrainersDoa";

describe(DynamoTrainersDao, ()=>{

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

    let dao: DynamoTrainersDao = new DynamoTrainersDao();

    beforeEach(()=>{
        dao = new DynamoTrainersDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })
    
    // describe(dao.getClientIdsOfTrainer, ()=>{
    //     it("should get 2 test clients", async ()=>{
    //         let ids = await dao.getClientIdsOfTrainer("testTrainer1");
    //         console.log(ids);
    //         expect(ids).toBeDefined();
    //         expect(ids.length).toBe(2)
    //         expect(ids).toContain("testClient1")
    //         expect(ids).toContain("testClient2")
    //     })
    // })

    // describe(dao.isTrainerOfClient, ()=>{
    //     it("should return true for testTrainer1 and testClient1", async ()=>{
    //         let res = await dao.isTrainerOfClient("testTrainer1", "testClient1");
    //         expect(res).toBeTruthy();
    //     })
    // })

    // describe(dao.isTrainerOfClient, ()=>{
    //     it("should return true for testTrainer1 and fakeClient", async ()=>{
    //         let res = await dao.isTrainerOfClient("testTrainer1", "fakeClient");
    //         expect(res).toBeFalsy();
    //     })
    // })


})
