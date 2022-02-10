import { UserSearchRequest, UserSearchResponse } from "../../shared/models/requests/UserSearchRequest";
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";

export default class UserDataService {
    public async isUserTrainerOfUser(trainer:User,user:User): Promise<boolean> {
        // TODO: implement with serverfacade
        return false;
    }
    public async isUserPartnerOfUser(partner:User,user:User): Promise<boolean> {
        // TODO: implement with serverfacade
        return false;
    }
    
    public async userSearch(request:UserSearchRequest): Promise<UserSearchResponse> {
        return await ServerFacade.userSearch(request);
    }
    
    public async getUser(userId:string): Promise<User|undefined> {
        return await ServerFacade.getUserById(userId);
    }
}