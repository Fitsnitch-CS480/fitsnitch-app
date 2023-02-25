import PartnerAssociationPair from "../../../../react-native-app/shared/models/PartnerAssociationPair";
import DynamoPartnerAssociationDao from "./DynamoPartnerAssociationDao";

describe(DynamoPartnerAssociationDao, ()=>{

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

    let dao: DynamoPartnerAssociationDao = new DynamoPartnerAssociationDao();
    let user1Id = "user1"
    let user2Id = "user2"
    let user3Id = "user3"
    let user4Id = "user4"

    beforeEach(()=>{
        dao = new DynamoPartnerAssociationDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })


    // describe("getuserIdsOfPartner", ()=>{
    //     it("should create and get by partner2", async ()=>{
    //         await dao.assignPartnership(new PartnerAssociationPair (user1Id,user2Id));
    //         await dao.assignPartnership(new PartnerAssociationPair(user1Id,user3Id));
    //         let resPartner = await dao.getPartnerIdsOfUser(user1Id);

    //         expect(resPartner).toContainEqual(user2Id)
    //         expect(resPartner).toContainEqual(user3Id)
    //         console.log(resPartner);
    //     })
    // })


    // describe(dao.removePartnership, ()=>{
    //     it("should remove Test PartnerAssociationPair", async ()=>{
    //         let request = new PartnerAssociationPair(user1Id,user4Id);
           
    //         await dao.assignPartnership(new PartnerAssociationPair (user1Id,user4Id));
    //         let resPartner = await dao.getPartnerIdsOfUser(user1Id);

    //         expect(resPartner).toContainEqual(user4Id)


    //         await dao.removePartnership(request);
    //         let resPartnerFound = await dao.getPartnerIdsOfUser(user1Id);
    //         let resPartnerFound1 = await dao.getPartnerIdsOfUser(user4Id);

    //         expect(resPartnerFound).not.toContainEqual(user4Id)

    //         expect(resPartnerFound1).not.toContainEqual(user1Id)
    //     })
    // })

  //   describe(dao.partnershipExists, ()=>{
  //     it("Assures whether partnerships exists or not", async ()=>{
         
  //         await dao.assignPartnership(new PartnerAssociationPair (user1Id,user2Id));
  //         await dao.assignPartnership(new PartnerAssociationPair(user1Id,user4Id));

  //         const part1 = await dao.partnershipExists(new PartnerAssociationPair (user1Id,user4Id));
  //         const part2 = await dao.partnershipExists(new PartnerAssociationPair (user1Id,user2Id));
  //         const part3 = await dao.partnershipExists(new PartnerAssociationPair (user3Id,user2Id));
  //         const part4 = await dao.partnershipExists(new PartnerAssociationPair (user4Id,user3Id));

  //         expect(part1).toEqual(true)
  //         expect(part2).toEqual(true)
  //         expect(part3).toEqual(false)
  //         expect(part4).toEqual(false)
  //     })
  // })
})
