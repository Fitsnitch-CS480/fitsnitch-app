import PartnerAssociationPair from "../../../../shared/models/PartnerAssociationPair";
import PartnerAssociationDao from "../PartnerAssociationDAO";
import TableAccessObject, { SortOp } from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoPartnerAssociationDao implements PartnerAssociationDao {
    private table = new TableAccessObject<PartnerAssociationPair>(DB_TABLES.TRAINERS);
    private partner1Index = this.table.createIndexAccessObject(DB_TABLES.TRAINERS_INDEX_BY_CLIENTS);

    async assignPartner2ToPartner1(data:PartnerAssociationPair) {
        // Make sure client does not already have a trainer
        let res = await this.partner1Index.query(data.partner1Id);
        if (res.length > 0) throw new Error("Partner1 is already a partner with Partner2!");
        await this.table.createOrUpdate(data);
    }

    async isPartner2OfPartner1(pair:PartnerAssociationPair): Promise<boolean> {
        let pairs = await this.table.query(pair.partner2Id, SortOp.EQUALS, pair.partner1Id);
        if (pairs.length === 0) return false;
        else return true;
    }

    async getpartner1IdsOfPartner2(partner2Id: string): Promise<string[]> {
        let pairs = await this.table.query(partner2Id);
        return pairs.map(p=>p.partner1Id);
    }
    
    async getPartner2IdOfPartner1(partner1Id: string): Promise<string> {
        let res = await this.partner1Index.query(partner1Id);
        if (res.length === 0) return "";
        else return res[0].partner2Id;
    }
    
    async removePartner2FromPartner1(data: PartnerAssociationPair) {
        await this.table.deleteByKeys(data.partner2Id,data.partner1Id);
    }
}