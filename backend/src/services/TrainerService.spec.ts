import User from "../../../react-native-app/shared/models/User";
import TrainerService from "./TrainerService";

describe(TrainerService, ()=>{

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

    let service: TrainerService = new TrainerService();

    beforeEach(()=>{
        service = new TrainerService();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })

    // describe(service.getRequestsByTrainer, ()=>{
    //     it("should get Users who have requested TrainerId", async ()=>{
    //         let users = await service.getRequestsByTrainer("81885d13-1288-4298-ab5d-eaf85d9b2594");
    //         console.log(users);
    //         expect(users).toBeDefined();
    //         expect(users.length).toBeGreaterThan(0)
    //     })
    // })

    // describe(service.createUser, ()=>{
    //     it("should create Test User", async ()=>{
    //         let user = new User("testUser","test@email.com",undefined,"User");            
    //         await service.createUser(user);
    //         let resUser = await service.getUser(user.userId);
    //         console.log(resUser);
    //         expect(resUser).toBeDefined();
    //         expect(resUser).toMatchObject(user);
    //     })
    // })

    // describe(service.search, ()=>{
    //     it("should create many search for test Users", async ()=>{
    //         for (let i = 1; i <= 30; i++) {
    //             let user = new User("testUser"+i,i+"test@email.com","Test "+i,"User");            
    //             await service.createUser(user);    
    //         }
    //         let res = await service.search(new UserSearchRequest("test",undefined,undefined));
    //         console.log(res);
    //         expect(res.records.length).toBeGreaterThanOrEqual(30);
    //     })

        // it ("should return no more than page size", async ()=>{
        //     let pageSize = 5;
        //     let res = await service.search(new UserSearchRequest("test",undefined,pageSize));
        //     console.log(res);
        //     expect(res.records.length).toBeLessThanOrEqual(pageSize)
        // })
        
        // it ("should get multiple pages", async ()=>{
        //     // assumes num test users is around 30
        //     let pageSize = 25;
        //     let res = await service.search(new UserSearchRequest("test",undefined,pageSize));
        //     console.log(res);
        //     expect(res.records.length).toBeLessThanOrEqual(pageSize)
        //     expect(res.pageBreakKey).toBeDefined();

        //     let previousResults = res.records;

        //     res = await service.search(new UserSearchRequest("test",res.pageBreakKey,pageSize));
        //     console.log(res);
        //     expect(res.records.length).toBeLessThanOrEqual(pageSize)
        //     expect(res.pageBreakKey).not.toBeDefined();

        //     res.records.forEach(r=>{
        //         expect(previousResults).not.toContainEqual(r);
        //     })
        // })
    // })
})
