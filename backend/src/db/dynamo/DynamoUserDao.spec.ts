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

    // describe(dao.getUser, ()=>{
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
    // })

})
