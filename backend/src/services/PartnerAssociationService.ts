import { PartnerStatusResponse } from './../../../react-native-app/shared/models/requests/PartnerStatusResponse';
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerRequest from "../../../react-native-app/shared/models/PartnerRequest";
import DaoFactory from "../db/DaoFactory";
import User from '../../../react-native-app/shared/models/User';

export default class PartnerAssociationService {

  async getRelationshipStatus(pair: PartnerAssociationPair): Promise<PartnerStatusResponse> {
    let partnerRequest = new PartnerRequest(pair.partnerId1, pair.partnerId2);
    let pending = await DaoFactory.getPartnerAssociationRequestDao().partnershipRequestExists(partnerRequest);

    if (pending) return new PartnerStatusResponse(RelationshipStatus.PENDING, partnerRequest);

    partnerRequest = new PartnerRequest(pair.partnerId2, pair.partnerId1);
    pending = await DaoFactory.getPartnerAssociationRequestDao().partnershipRequestExists(partnerRequest);

    if (pending) return new PartnerStatusResponse(RelationshipStatus.PENDING, partnerRequest);
    
    let approved = await DaoFactory.getPartnerAssociationDao().partnershipExists(pair);
    if (approved) return new PartnerStatusResponse(RelationshipStatus.APPROVED, undefined);;

    return new PartnerStatusResponse(RelationshipStatus.NONEXISTENT, undefined);
}
    //
    // REQUESTS
    //
np
    async requestPartnerAssociation(data: PartnerRequest) {
      // console.log("this is data for request partner: ", data)
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
        let partner = new PartnerAssociationPair(request.requestee, request.requester);
        await DaoFactory.getPartnerAssociationDao().assignPartnership(partner);
        await DaoFactory.getPartnerAssociationRequestDao().deletePartnerAssociationRequest(request);
    }
    
    async removePartnerAssociationFromUser(data: PartnerAssociationPair) {
        await DaoFactory.getPartnerAssociationDao().removePartnership(data);
    }
    
    async getPartnersOfUser(userId:string):Promise<User[]> {
        let ids = await DaoFactory.getPartnerAssociationDao().getPartnerIdsOfUser(userId);
        let partners: User[] = [];
        await Promise.all(ids.map(async id=>{
            let user = await DaoFactory.getUserDao().getUser(id)
            if (user) partners.push(user)
        }))
        return partners;
    }
}