import PartnerRequest from "../../../../react-native-app/shared/models/PartnerRequest";
import DynamoPartnerAssociationRequestDao from "./DynamoPartnerAssociationRequestDao";

describe(DynamoPartnerAssociationRequestDao, ()=>{

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

    let dao: DynamoPartnerAssociationRequestDao = new DynamoPartnerAssociationRequestDao();
    let user1Id = "user1"
    let user2Id = "user2"
    let user3Id = "user3"
    let user4Id = "user4"

    beforeEach(()=>{
        dao = new DynamoPartnerAssociationRequestDao();
    });

    describe("just to avoid no-test errors", ()=>{
        it("should have a test", async ()=>{
        })
    })


      describe("getRequestsByRequester", ()=>{
          it("should create and get by requester", async ()=>{
              await dao.createPartnerAssociationRequest(new PartnerRequest(user1Id,user2Id));
              await dao.createPartnerAssociationRequest(new PartnerRequest(user1Id,user3Id));
              let resRequesterRequests = await dao.getRequestsByRequester(user1Id);
  
              expect(resRequesterRequests).toContainEqual(new PartnerRequest(user1Id,user2Id))
              expect(resRequesterRequests).toContainEqual(new PartnerRequest(user1Id,user3Id))
              console.log(resRequesterRequests);
          })
      })

    //   describe("getRequestsByRequestee", ()=>{
    //     it("should create and get by requestee", async ()=>{
    //         await dao.createPartnerAssociationRequest(new PartnerRequest(user1Id,user2Id));
    //         await dao.createPartnerAssociationRequest(new PartnerRequest(user1Id,user3Id));
    //         let resRequestee1Requests = await dao.getRequestsByRequestee(user2Id);
    //         let resRequestee2Requests = await dao.getRequestsByRequestee(user3Id);

    //         expect(resRequestee1Requests).toContainEqual(new PartnerRequest(user1Id,user2Id))
    //         expect(resRequestee2Requests).toContainEqual(new PartnerRequest(user1Id,user3Id))
    //         console.log(resRequestee1Requests);
    //         console.log(resRequestee2Requests);
    //     })
    // })

    //    describe(dao.deletePartnerAssociationRequest, ()=>{
    //     it("should delete Test PartnerRequest", async ()=>{
    //         let request = new PartnerRequest(user1Id,user4Id);
    //         await dao.createPartnerAssociationRequest(request);
    //         let resRequesterRequests = await dao.getRequestsByRequester(user1Id);
    //         expect(resRequesterRequests).toContainEqual(request)
    //         await dao.deletePartnerAssociationRequest(request);
    //         resRequesterRequests = await dao.getRequestsByRequester(user1Id);
    //         expect(resRequesterRequests).not.toContainEqual(request)
    //     })
    // })

    // describe(dao.deleteAllUserRequests, ()=>{
    //     it("should delete all requests with user", async ()=>{
    //         let req1 = new PartnerRequest(user1Id,user4Id);
    //         await dao.createPartnerAssociationRequest(req1);
    //         let resPartnerRequests = await dao.getRequestsByRequestee(user4Id);
    //         expect(resPartnerRequests).toContainEqual(req1);

    //         let req2 = new PartnerRequest(user4Id,user1Id);
    //         await dao.createPartnerAssociationRequest(req2);
    //         resPartnerRequests = await dao.getRequestsByRequester(user4Id);
    //         expect(resPartnerRequests).toContainEqual(req2)

    //         await dao.deleteAllUserRequests(user1Id);
    //         resPartnerRequests = await dao.getRequestsByRequestee(user1Id);
    //         expect(resPartnerRequests).toHaveLength(0);

    //         resPartnerRequests = await dao.getRequestsByRequester(user1Id);
    //         expect(resPartnerRequests).toHaveLength(0);
    //     })
    // })

    //    describe(dao.partnershipRequestExists, ()=>{
    //     it("should return true for existing partnership request", async ()=>{
    //         let request = new PartnerRequest(user1Id,user4Id);
    //         await dao.createPartnerAssociationRequest(request);
    //         let resRequestExists = await dao.partnershipRequestExists(new PartnerRequest(user1Id,user4Id));
    //         expect(resRequestExists).toEqual(true)
    //     })
    // })
})
