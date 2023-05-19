import CheatMealEvent from "../../../../react-native-app/shared/models/CheatMealEvent";
import { GetCheatMealRequest } from "../../../../react-native-app/shared/models/requests/GetCheatMealRequest";
import { UserCheatMealRequest } from "../../../../react-native-app/shared/models/requests/UserCheatMealRequest";
import DynamoCheatMealDao from "./DynamoCheatMealDao";


describe(DynamoCheatMealDao, ()=> {
    //TODO: fill
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

    let dao: DynamoCheatMealDao = new DynamoCheatMealDao();
    let user1Id = "testUser1";
    let created1 = "2022-01-05T5:30:00"

    function generateFakeCheatMeal(userId, created_at) {
        return new CheatMealEvent(userId, created_at, {lat:0,lon:0}, {name:"Chili's",location:{lat:0,lon:0}});
    }

    beforeEach(()=>{
        dao = new DynamoCheatMealDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })

    describe(dao.getUserCheatMeals, ()=>{
    //     it("should get cheat meals", async ()=>{
    //         let request = new UserCheatMealRequest("testUser2");
    //         let response = await dao.getUserCheatMeals(request);
    //         console.log(response);
    //     })
        
    //     it("should get multiple pages", async ()=>{
    //         let request = new UserCheatMealRequest("testUser2", 3);
    //         let response = await dao.getUserCheatMeals(request);
    //         console.log(response);

    //         expect(response.records).toMatchObject([
    //             { created_at: '2022-04-02T12:00:00', userId: 'testUser2' },
    //             { created_at: '2022-03-02T12:00:00', userId: 'testUser2' },
    //             { created_at: '2022-02-03T11:00:00', userId: 'testUser2' }
    //         ]);
    //         // is getting the correct key just showing created_at and userID instead of everything.
    //         // expect(response.pageBreakKey).toBe(JSON.stringify(response.records[response.records.length-1]));

    //         request.pageBreakKey = response.pageBreakKey;
    //         response = await dao.getUserCheatMeals(request);
    //         console.log(response);

    //         expect(response.records).toMatchObject([
    //             { created_at: '2022-02-02T12:00:00', userId: 'testUser2' }
    //         ]);
    //         expect(response.pageBreakKey).not.toBeDefined();
        })

        
    //     it("should call cheat meal", async ()=>{
    //         let spy = jest.spyOn(dao, "getUserCheatMeals");
    //         let request = new UserCheatMealRequest("testUser2", 10);
    //         let response = await dao.getUserCheatMeals(request);
    //         console.log(response);
    //         expect(spy).toHaveBeenCalled();
    //     })
        
    // })

    // describe("CRUD", ()=>{
    //     it("perform all crud actions", async ()=>{
    //         // CREATE and READ

    //         let cheatMeal = generateFakeCheatMeal(user1Id, created1)
    //         await dao.createCheatMeal(cheatMeal);
    //         let resCheatMeal = await dao.getCheatMeal(new GetCheatMealRequest(cheatMeal.userId, cheatMeal.created_at));

    //         expect(resCheatMeal).toMatchObject(cheatMeal)
    //         console.log(resCheatMeal);

    //         // UPDATE
    //         cheatMeal.restaurantData.name = "Chucky Cheese"
    //         await dao.updateCheatMeal(cheatMeal);

    //         resCheatMeal = await dao.getCheatMeal(new GetCheatMealRequest(cheatMeal.userId, cheatMeal.created_at));
    //         expect(resCheatMeal).toMatchObject(cheatMeal)
    //         console.log(resCheatMeal);

    //         // DELETE
    //         await dao.deleteCheatMeal(cheatMeal);
    //         resCheatMeal = await dao.getCheatMeal(new GetCheatMealRequest(cheatMeal.userId, cheatMeal.created_at));
    //         expect(resCheatMeal).toBeNull();
    //         console.log(resCheatMeal);
    //     })
    // })
})