import PartnerStatusResponse from '../../../react-native-app/shared/models/requests/PartnerStatusResponse';
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerRequest from "../../../react-native-app/shared/models/PartnerRequest";
import DaoFactory from "../db/DaoFactory";
import User from '../../../react-native-app/shared/models/User';
import UserService from './UserService';

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

    async requestPartnerAssociation(data: PartnerRequest) {
        await DaoFactory.getPartnerAssociationRequestDao().createPartnerAssociationRequest(data);
    }

    async deletePartnerAssociationRequest(data: PartnerRequest) {
        await DaoFactory.getPartnerAssociationRequestDao().deletePartnerAssociationRequest(data);
    }
    
    async getRequesteesByRequester(userId:string):Promise<User[]> {
        let requests = await DaoFactory.getPartnerAssociationRequestDao().getRequestsByRequestee(userId);
        return new UserService().getExistingUsers(requests.map(r=>r.requestee));
    }
    
    async getRequestersByRequestee(userId:string):Promise<User[]> {
        let requests = await DaoFactory.getPartnerAssociationRequestDao().getRequestsByRequestee(userId);
        return new UserService().getExistingUsers(requests.map(r=>r.requester));
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
        return new UserService().getExistingUsers(ids);
    }

}