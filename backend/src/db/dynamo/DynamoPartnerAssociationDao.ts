import PartnerAssociationPair from "../../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerAssociationDao from "../PartnerAssociationDAO";
import TableAccessObject, { SortOp } from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoPartnerAssociationDao implements PartnerAssociationDao {
    private table = new TableAccessObject<PartnerAssociationPair>(DB_TABLES.PARTNER);
    private index = this.table.createIndexAccessObject(DB_TABLES.PARTNER_INDEX);

    async assignPartnership(data:PartnerAssociationPair) {
        //Assign partnership
        await this.table.createOrUpdate(data);
    }

    async partnershipExists(pair:PartnerAssociationPair): Promise<boolean> {
        let res = await this.table.query(pair.partnerId1, SortOp.EQUALS, pair.partnerId2);
        if(res.length !== 0) return true;
        
        let pairs = await this.table.query(pair.partnerId2, SortOp.EQUALS, pair.partnerId1);
        if (pairs.length !== 0) return true;

        else return false;
    }

    async getPartnerIdsOfUser(id: string): Promise<string[]> {
      let res = await (await this.table.query(id)).map(pair => pair.partnerId2);
      let res1 = await (await this.index.query(id)).map(pair => pair.partnerId1);
      
      return [...res, ...res1];
  }
    
    
    async removePartnership(data: PartnerAssociationPair) {
        await this.table.deleteByKeys(data.partnerId1,data.partnerId2);
    }
}