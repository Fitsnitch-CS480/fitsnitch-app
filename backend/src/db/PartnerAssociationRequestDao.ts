import PartnerRequest from "../../../react-native-app/shared/models/PartnerRequest";


export default interface PartnerAssociationRequestDao {
    createPartnerAssociationRequest(data:PartnerRequest);
    deletePartnerAssociationRequest(data:PartnerRequest);

    existsRequest(data:PartnerRequest): Promise<boolean>;

    /**
     * Finds all requests where this userId is the Trainer
     * @param userId 
     */
    getRequestsByRequestee(userId:string): Promise<PartnerRequest[]>;

    /**
     * Finds all requests where this userId is the Client
     * @param userId 
     */
    getRequestsByRequester(userId:string): Promise<PartnerRequest[]>;

    /**
     * Used when wiping a user's data. Removes any request with userId
     * @param userId 
     */
    deleteAllUserRequests(userId:string);
}