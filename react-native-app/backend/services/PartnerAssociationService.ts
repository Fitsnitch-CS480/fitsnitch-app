import PartnerStatusResponse from './../../shared/models/requests/PartnerStatusResponse';
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";

export default class PartnerAssociationService {
    public async getPartnerStatus(partner:User,user:User): Promise<PartnerStatusResponse> {
        return await ServerFacade.getPartnerStatus(partner,user);
    }
    
    public async getUserPartners(userId:string): Promise<User[]> {
        return await ServerFacade.getUserPartners(userId);
    }
    
    public async requestPartnerForUser(partner:User,user:User) {
        await ServerFacade.requestPartnerForUser(partner,user);
    }

    public async getPartnerRequesters(userId:string): Promise<User[]> {
        return await ServerFacade.getPartnerRequesters(userId);
    }

    public async deleteRequest(partner:User,user:User) {
        await ServerFacade.cancelPartnerRequest(partner,user);
    }

    public async approveRequest(requester:User,requestee:User) {
        await ServerFacade.approvePartnerRequest(requester,requestee);
    }
    
    public async removePartnerFromUser(partner:User,user:User) {
        await ServerFacade.removePartnerFromUser(partner,user);
    }
}