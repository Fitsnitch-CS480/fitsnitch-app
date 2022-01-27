import PartnerAssociationPair from "../../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerAssociationRequestDao from "../PartnerAssociationRequestDao";
import TableAccessObject from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoPartnerAssociationRequestDao implements PartnerAssociationRequestDao {
    private table = new TableAccessObject<PartnerAssociationPair>(DB_TABLES.PARTNER_REQUESTS);
    private partner1Index = this.table.createIndexAccessObject(DB_TABLES.PARTNER_REQUESTS_BY_USER);
    
    async createPartnerAssociationRequest(data: PartnerAssociationPair) {
        await this.table.createOrUpdate(data);
    }

    // fat arrow funtion to preserve this context
    deletePartnerAssociationRequest = async (request: PartnerAssociationPair) => {
        return await this.table.deleteByKeys(request.partnerId2,request.partnerId1);
    }

    async getRequestsByPartner2(partnerId2: string): Promise<PartnerAssociationPair[]> {
        return await this.table.query(partnerId2);
    }

    async getRequestsByPartner1(partnerId1: string): Promise<PartnerAssociationPair[]> {
        return await this.partner1Index.query(partnerId1);
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