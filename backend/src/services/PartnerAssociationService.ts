import PartnerAssociationPair from "../../../shared/models/PartnerAssociationPair";
import DaoFactory from "../db/DaoFactory";

export default class PartnerAssociationService {
    //
    // REQUESTS
    //

    async requestPartnerAssociation(data: PartnerAssociationPair) {
        await DaoFactory.getPartnerAssociationRequestDao().createPartnerAssociationRequest(data);
    }

    async deletePartnerAssociationRequest(data: PartnerAssociationPair) {
        await DaoFactory.getPartnerAssociationRequestDao().deletePartnerAssociationRequest(data);
    }
    
    async getRequestsByPartner1(userId:string):Promise<PartnerAssociationPair[]> {
        return await DaoFactory.getPartnerAssociationRequestDao().getRequestsByPartner1(userId);
    }
    
    async getRequestsByPartner2(userId:string):Promise<PartnerAssociationPair[]> {
        return await DaoFactory.getPartnerAssociationRequestDao().getRequestsByPartner2(userId);
    }

    //
    // APPROVED CONNECTIONS
    //

    async approvePartnerAssociationRequest(request: PartnerAssociationPair) {
        // wait for successsful creation before removing request to catch errors
        await DaoFactory.getPartnerAssociationDao().assignPartner2ToPartner1(request);
        await DaoFactory.getPartnerAssociationRequestDao().deletePartnerAssociationRequest(request);
    }
    
    async removePartnerAssociationFromClient(data: PartnerAssociationPair) {
        await DaoFactory.getPartnerAssociationDao().removePartner2FromPartner1(data);
    }
    
    async getPartner1IdsOfPartner2(userId:string):Promise<string[]> {
        return await DaoFactory.getPartnerAssociationDao().getpartner1IdsOfPartner2(userId);
    }
    
    async getPartner2IdOfPartner1(userId:string):Promise<string> {
        return await DaoFactory.getPartnerAssociationDao().getPartner2IdOfPartner1(userId);
    }


}