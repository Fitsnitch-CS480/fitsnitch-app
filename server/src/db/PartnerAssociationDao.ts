import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";

export default interface AccountabilitPartnerDao {
    assignPartnership(data:PartnerAssociationPair);
    partnershipExists(data:PartnerAssociationPair): Promise<boolean>;
    getPartnerIdsOfUser(id:string): Promise<string[]>
    removePartnership(data:PartnerAssociationPair);
}
