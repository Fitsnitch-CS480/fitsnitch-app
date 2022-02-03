import { PartnerStatusResponse } from './../../../react-native-app/shared/models/requests/PartnerStatusResponse';
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerRequest from "../../../react-native-app/shared/models/PartnerRequest";
import DaoFactory from "../db/DaoFactory";

export default class PartnerAssociationService {

  async getRelationshipStatus(pair: PartnerAssociationPair): Promise<PartnerStatusResponse> {
    let partnerRequest = new PartnerRequest(pair.partnerId1, pair.partnerId2);
    let pending = await DaoFactory.getPartnerAssociationRequestDao().existsRequest(partnerRequest);

    if (pending) return new PartnerStatusResponse(RelationshipStatus.PENDING, partnerRequest);

    partnerRequest = new PartnerRequest(pair.partnerId2, pair.partnerId1);
    pending = await DaoFactory.getPartnerAssociationRequestDao().existsRequest(partnerRequest);

    if (pending) return new PartnerStatusResponse(RelationshipStatus.PENDING, partnerRequest);
    
    let approved = await DaoFactory.getPartnerAssociationDao().isPartner2OfPartner1(pair);
    if (approved) return new PartnerStatusResponse(RelationshipStatus.APPROVED, undefined);;

    return new PartnerStatusResponse(RelationshipStatus.NONEXISTENT, undefined);
}
    //
    // REQUESTS
    //

    async requestPartnerAssociation(data: PartnerRequest) {
        await DaoFactory.getPartnerAssociationRequestDao().createPartnerAssociationRequest(data);
    }

    async deletePartnerAssociationRequest(data: PartnerRequest) {
        await DaoFactory.getPartnerAssociationRequestDao().deletePartnerAssociationRequest(data);
    }
    
    async getRequestsByRequester(userId:string):Promise<PartnerRequest[]> {
        return await DaoFactory.getPartnerAssociationRequestDao().getRequestsByRequester(userId);
    }
    
    async getRequestsByRequestee(userId:string):Promise<PartnerRequest[]> {
        return await DaoFactory.getPartnerAssociationRequestDao().getRequestsByRequestee(userId);
    }

    //
    // APPROVED CONNECTIONS
    //

    async approvePartnerAssociationRequest(request: PartnerRequest) {
        // wait for successsful creation before removing request to catch errors
        let partner = new PartnerAssociationPair(request.requesteeId, request.requesterId);
        await DaoFactory.getPartnerAssociationDao().assignPartner2ToPartner1(partner);
        await DaoFactory.getPartnerAssociationRequestDao().deletePartnerAssociationRequest(request);
    }
    
    async removePartnerAssociationFromUser(data: PartnerAssociationPair) {
        await DaoFactory.getPartnerAssociationDao().removePartner2FromPartner1(data);
    }
    
    async getPartner1IdsOfPartner2(userId:string):Promise<string[]> {
        return await DaoFactory.getPartnerAssociationDao().getpartner1IdsOfPartner2(userId);
    }
    
    async getPartner2IdOfPartner1(userId:string):Promise<string> {
        return await DaoFactory.getPartnerAssociationDao().getPartner2IdOfPartner1(userId);
    }


}