import PartnerAssociationPair from "../../../shared/models/PartnerAssociationPair";

export default interface PartnerAssociationRequestDao {
    createPartnerAssociationRequest(data:PartnerAssociationPair);
    deletePartnerAssociationRequest(data:PartnerAssociationPair);

    /**
     * Finds all requests where this userId is the Trainer
     * @param userId 
     */
    getRequestsByPartner2(userId:string): Promise<PartnerAssociationPair[]>;

    /**
     * Finds all requests where this userId is the Client
     * @param userId 
     */
    getRequestsByPartner1(userId:string): Promise<PartnerAssociationPair[]>;

    /**
     * Used when wiping a user's data. Removes any request with userId
     * @param userId 
     */
    deleteAllUserRequests(userId:string);
}