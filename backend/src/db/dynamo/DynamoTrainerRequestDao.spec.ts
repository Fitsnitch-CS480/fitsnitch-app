import TrainerClientPair from "../../../../react-native-app/shared/models/TrainerClientPair";
import DynamoTrainerRequestDao from "./DynamoTrainerRequestDao";

describe(DynamoTrainerRequestDao, ()=>{

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

    let dao: DynamoTrainerRequestDao = new DynamoTrainerRequestDao();
    let user1Id = "user1"
    let user2Id = "user2"
    let user3Id = "user3"
    let user4Id = "user4"

    beforeEach(()=>{
        dao = new DynamoTrainerRequestDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })


    describe("getRequestsByTrainer", ()=>{
        // it("should create and get by trainer", async ()=>{
        //     await dao.createTrainerRequest(new TrainerClientPair(user1Id,user2Id));
        //     await dao.createTrainerRequest(new TrainerClientPair(user1Id,user3Id));
        //     let resTrainerRequests = await dao.getRequestsByTrainer(user1Id);

        //     expect(resTrainerRequests).toContainEqual(new TrainerClientPair(user1Id,user2Id))
        //     expect(resTrainerRequests).toContainEqual(new TrainerClientPair(user1Id,user3Id))
        //     console.log(resTrainerRequests);
        // })

        // it("should get live data", async ()=>{
        //     let resTrainerRequests = await dao.getRequestsByTrainer("81885d13-1288-4298-ab5d-eaf85d9b2594");
        //     expect(resTrainerRequests.length).toBeGreaterThan(0)
        //     console.log(resTrainerRequests);
        // })
    })

    

    // describe("getRequestsByClient", ()=>{
    //     it("should create and get by client", async ()=>{
    //         await dao.createTrainerRequest(new TrainerClientPair(user2Id,user1Id));
    //         await dao.createTrainerRequest(new TrainerClientPair(user3Id,user1Id));
    //         let resTrainerRequests = await dao.getRequestsByClient(user1Id);

    //         expect(resTrainerRequests).toContainEqual(new TrainerClientPair(user2Id,user1Id))
    //         expect(resTrainerRequests).toContainEqual(new TrainerClientPair(user3Id,user1Id))
    //         console.log(resTrainerRequests);
    //     })
    // })

    // describe(dao.deleteTrainerRequest, ()=>{
    //     it("should delete Test TrainerClientPair", async ()=>{
    //         let request = new TrainerClientPair(user1Id,user4Id);
    //         await dao.createTrainerRequest(request);
    //         let resTrainerRequests = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainerRequests).toContainEqual(request)
    //         await dao.deleteTrainerRequest(request);
    //         resTrainerRequests = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainerRequests).not.toContainEqual(request)
    //     })
    // })

    // describe(dao.deleteAllUserRequests, ()=>{
    //     it("should delete all requests with user", async ()=>{
    //         let req1 = new TrainerClientPair(user1Id,user4Id);
    //         await dao.createTrainerRequest(req1);
    //         let resTrainerRequests = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainerRequests).toContainEqual(req1);
    //         let req2 = new TrainerClientPair(user4Id,user1Id);
    //         await dao.createTrainerRequest(req2);
    //         resTrainerRequests = await dao.getRequestsByClient(user1Id);
    //         expect(resTrainerRequests).toContainEqual(req2)
    //         await dao.deleteAllUserRequests(user1Id);
    //         resTrainerRequests = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainerRequests).toHaveLength(0);
    //         resTrainerRequests = await dao.getRequestsByClient(user1Id);
    //         expect(resTrainerRequests).toHaveLength(0);
    //     })
    // })

})
