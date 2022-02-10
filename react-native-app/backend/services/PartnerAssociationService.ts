import { PartnerStatusResponse } from './../../shared/models/requests/PartnerStatusResponse';
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";

export default class PartnerAssociationService {
    public async getPartnerStatus(partner:User,user:User): Promise<PartnerStatusResponse> {
        return await ServerFacade.getPartnerStatus(partner,user);
    }
    
    public async requestPartnerForUser(partner:User,user:User) {
        await ServerFacade.requestPartnerForUser(partner,user);
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