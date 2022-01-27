import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";

export default interface AccountabilitPartnerDao {
    assignPartner2ToPartner1(data:PartnerAssociationPair);
    isPartner2OfPartner1(data:PartnerAssociationPair): Promise<boolean>;
    getpartner1IdsOfPartner2(partner1Id:string): Promise<string[]>;
    getPartner2IdOfPartner1(partner2Id:string): Promise<string>;
    removePartner2FromPartner1(data:PartnerAssociationPair);
}