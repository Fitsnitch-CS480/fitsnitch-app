import RelationshipStatus from "../../shared/constants/RelationshipStatus";
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";

export default class PartnerAssociationService {
    public async getPartnerStatus(partner:User,user:User): Promise<RelationshipStatus> {
        return await ServerFacade.getPartnerStatus(partner,user);
    }
    
    public async getUserPartner(userId:string): Promise<User|undefined> {
        return await ServerFacade.getUserPartner(userId);
    }
    
    public async requestPartnerForUser(partner:User,user:User) {
        await ServerFacade.requestTrainerForClient(partner,user);
    }

    public async cancelPartnerRequest(partner:User,user:User) {
        await ServerFacade.cancelPartnerRequest(partner,user);
    }

    public async approveUser(partner:User,user:User) {
        await ServerFacade.approveUser(partner,user);
    }
    
    public async removePartnerFromUser(partner:User,user:User) {
        await ServerFacade.removePartnerFromUser(partner,user);
    }
}