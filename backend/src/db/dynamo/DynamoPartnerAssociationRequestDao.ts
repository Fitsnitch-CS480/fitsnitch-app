import PartnerAssociationPair from "../../../../shared/models/PartnerAssociationPair";
import PartnerAssociationRequestDao from "../PartnerAssociationRequestDao";
import TableAccessObject from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoPartnerAssociationRequestDao implements PartnerAssociationRequestDao {
    private table = new TableAccessObject<PartnerAssociationPair>(DB_TABLES.TRAINER_REQUESTS);
    private clientIndex = this.table.createIndexAccessObject(DB_TABLES.TRAINER_REQUESTS_BY_CLIENT);
    
    async createPartnerAssociationRequest(data: PartnerAssociationPair) {
        await this.table.createOrUpdate(data);
    }

    // fat arrow funtion to preserve this context
    deletePartnerAssociationRequest = async (request: PartnerAssociationPair) => {
        return await this.table.deleteByKeys(request.partner2Id,request.partner1Id);
    }

    async getRequestsByPartner2(trainerId: string): Promise<PartnerAssociationPair[]> {
        return await this.table.query(trainerId);
    }

    async getRequestsByPartner1(clientId: string): Promise<PartnerAssociationPair[]> {
        return await this.clientIndex.query(clientId);
    }

    // For wiping data
    async deleteAllUserRequests(personId: string) {
        await Promise.all([
            // Find and delete all requests to follow user
            (async ()=>{
                let reqs = await this.getRequestsByPartner1(personId);
                await Promise.all(reqs.map(this.deletePartnerAssociationRequest));
            })(),
            
            // Find and delete all follow requests from user
            (async ()=>{
                let reqs = await this.getRequestsByPartner2(personId);
                await Promise.all(reqs.map(this.deletePartnerAssociationRequest));
            })(),
        ])
    }
}