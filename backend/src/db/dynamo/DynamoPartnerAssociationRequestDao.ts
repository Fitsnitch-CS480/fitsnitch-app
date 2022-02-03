import PartnerRequest from "../../../../react-native-app/shared/models/PartnerRequest";
import PartnerAssociationRequestDao from "../PartnerAssociationRequestDao";
import TableAccessObject, { SortOp } from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoPartnerAssociationRequestDao implements PartnerAssociationRequestDao {
    private table = new TableAccessObject<PartnerRequest>(DB_TABLES.PARTNER_REQUESTS);
    private partner1Index = this.table.createIndexAccessObject(DB_TABLES.PARTNER_REQUESTS);
    
    async createPartnerAssociationRequest(data: PartnerRequest) {
        await this.table.createOrUpdate(data);
    }

    async existsRequest(data:PartnerRequest): Promise<boolean> {
      let matches = await this.table.query(data.requesteeId,SortOp.EQUALS,data.requesterId);
      return matches.length == 1;
  }

    // fat arrow funtion to preserve this context
    deletePartnerAssociationRequest = async (request: PartnerRequest) => {
        return await this.table.deleteByKeys(request.requesteeId,request.requesterId);
    }

    async getRequestsByRequestee(requesteeId: string): Promise<PartnerRequest[]> {
        return await this.table.query(requesteeId);
    }

    async getRequestsByRequester(requesterId: string): Promise<PartnerRequest[]> {
        return await this.partner1Index.query(requesterId);
    }

    // For wiping data
    async deleteAllUserRequests(personId: string) {
        await Promise.all([
            // Find and delete all requests to follow user
            (async ()=>{
                let reqs = await this.getRequestsByRequester(personId);
                await Promise.all(reqs.map(this.deletePartnerAssociationRequest));
            })(),
            
            // Find and delete all follow requests from user
            (async ()=>{
                let reqs = await this.getRequestsByRequestee(personId);
                await Promise.all(reqs.map(this.deletePartnerAssociationRequest));
            })(),
        ])
    }
}