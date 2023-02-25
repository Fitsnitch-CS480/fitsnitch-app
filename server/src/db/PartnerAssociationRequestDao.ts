import PartnerRequest from "../../../react-native-app/shared/models/PartnerRequest";


export default interface PartnerAssociationRequestDao {
    createPartnerAssociationRequest(data:PartnerRequest);
    deletePartnerAssociationRequest(data:PartnerRequest);

    partnershipRequestExists(data:PartnerRequest): Promise<boolean>;

    /**
     * Finds all requests where this userId is the Requestee
     * @param userId 
     */
    getRequestsByRequestee(reuesteeId:string): Promise<PartnerRequest[]>;

    /**
     * Finds all requests where this userId is the Requester
     * @param userId 
     */
    getRequestsByRequester(reuesterId:string): Promise<PartnerRequest[]>;

    /**
     * Used when wiping a user's data. Removes any request with userId
     * @param userId 
     */
    deleteAllUserRequests(userId:string);
}