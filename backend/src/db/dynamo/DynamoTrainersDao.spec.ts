import TrainerClientPair from "../../../../shared/models/TrainerClientPair";
import DynamoTrainersDao from "./DynamoTrainersDao";

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
    let user1Id = "user1"
    let user2Id = "user2"
    let user3Id = "user3"
    let user4Id = "user4"

    beforeEach(()=>{
        dao = new DynamoTrainersDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })


    // describe("getClientIdsOfTrainer", ()=>{
    //     it("should create and get by trainer", async ()=>{
    //         await dao.assignTrainerToClient(new TrainerClientPair(user1Id,user2Id));
    //         await dao.assignTrainerToClient(new TrainerClientPair(user1Id,user3Id));
    //         let resTrainers = await dao.getClientIdsOfTrainer(user1Id);

    //         expect(resTrainers).toContainEqual(user2Id)
    //         expect(resTrainers).toContainEqual(user3Id)
    //         console.log(resTrainers);
    //     })
    // })

    

    // describe("getRequestsByClient", ()=>{
    //     it("should create and get by client", async ()=>{
    //         await dao.createTrainer(new TrainerClientPair(user2Id,user1Id));
    //         await dao.createTrainer(new TrainerClientPair(user3Id,user1Id));
    //         let resTrainers = await dao.getRequestsByClient(user1Id);

    //         expect(resTrainers).toContainEqual(new TrainerClientPair(user2Id,user1Id))
    //         expect(resTrainers).toContainEqual(new TrainerClientPair(user3Id,user1Id))
    //         console.log(resTrainers);
    //     })
    // })

    // describe(dao.deleteTrainer, ()=>{
    //     it("should delete Test TrainerClientPair", async ()=>{
    //         let request = new TrainerClientPair(user1Id,user4Id);
    //         await dao.createTrainer(request);
    //         let resTrainers = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainers).toContainEqual(request)
    //         await dao.deleteTrainer(request);
    //         resTrainers = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainers).not.toContainEqual(request)
    //     })
    // })

    // describe(dao.deleteAllUserRequests, ()=>{
    //     it("should delete all requests with user", async ()=>{
    //         let req1 = new TrainerClientPair(user1Id,user4Id);
    //         await dao.createTrainer(req1);
    //         let resTrainers = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainers).toContainEqual(req1);
    //         let req2 = new TrainerClientPair(user4Id,user1Id);
    //         await dao.createTrainer(req2);
    //         resTrainers = await dao.getRequestsByClient(user1Id);
    //         expect(resTrainers).toContainEqual(req2)
    //         await dao.deleteAllUserRequests(user1Id);
    //         resTrainers = await dao.getRequestsByTrainer(user1Id);
    //         expect(resTrainers).toHaveLength(0);
    //         resTrainers = await dao.getRequestsByClient(user1Id);
    //         expect(resTrainers).toHaveLength(0);
    //     })
    // })

})
