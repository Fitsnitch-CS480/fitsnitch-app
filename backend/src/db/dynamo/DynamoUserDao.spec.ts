import { UserSearchRequest } from "../../../../react-native-app/shared/models/requests/UserSearchRequest";
import User from "../../../../react-native-app/shared/models/User";
import DynamoUserDao from "./DynamoUserDao";

describe(DynamoUserDao, ()=>{

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

    let dao: DynamoUserDao = new DynamoUserDao();

    beforeEach(()=>{
        dao = new DynamoUserDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })

    describe(dao.getUser, ()=>{
    //     it("should get Chef", async ()=>{
    //         let user = await dao.getUser("testUser");
    //         console.log(user);
    //         expect(user).toBeDefined();
    //         expect(user?.firstname).toBe("Chef")
    //     })
    // })

    // describe(dao.createUser, ()=>{
    //     it("should create Test User", async ()=>{
    //         let user = new User("testUser","test@email.com",undefined,"User");            
    //         await dao.createUser(user);
    //         let resUser = await dao.getUser(user.userId);
    //         console.log(resUser);
    //         expect(resUser).toBeDefined();
    //         expect(resUser).toMatchObject(user);
    //     })
    })

    describe(dao.search, ()=>{
    //     it("should create many search for test Users", async ()=>{
    //         for (let i = 1; i <= 30; i++) {
    //             let user = new User("testUser"+i,i+"test@email.com","Test "+i,"User");            
    //             await dao.createUser(user);    
    //         }
    //         let res = await dao.search(new UserSearchRequest("test",undefined,undefined));
    //         console.log(res);
    //         expect(res.records.length).toBeGreaterThanOrEqual(30);
    //     })

        // it ("should return no more than page size", async ()=>{
        //     let pageSize = 5;
        //     let res = await dao.search(new UserSearchRequest("test",undefined,pageSize));
        //     console.log(res);
        //     expect(res.records.length).toBeLessThanOrEqual(pageSize)
        // })
        
        // it ("should get multiple pages", async ()=>{
        //     // assumes num test users is around 30
        //     let pageSize = 25;
        //     let res = await dao.search(new UserSearchRequest("test",undefined,pageSize));
        //     console.log(res);
        //     expect(res.records.length).toBeLessThanOrEqual(pageSize)
        //     expect(res.pageBreakKey).toBeDefined();

        //     let previousResults = res.records;

        //     res = await dao.search(new UserSearchRequest("test",res.pageBreakKey,pageSize));
        //     console.log(res);
        //     expect(res.records.length).toBeLessThanOrEqual(pageSize)
        //     expect(res.pageBreakKey).not.toBeDefined();

        //     res.records.forEach(r=>{
        //         expect(previousResults).not.toContainEqual(r);
        //     })
        // })

    })
})
