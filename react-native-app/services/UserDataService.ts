import User from "../shared/models/User";
import ServerFacade from "./ServerFacade";

export default class UserDataService {
    public async isUserTrainerOfUser(trainer:User,user:User): Promise<boolean> {
        // TODO: implement with serverfacade
        return false;
    }
    public async isUserPartnerOfUser(partner:User,user:User): Promise<boolean> {
        // TODO: implement with serverfacade
        return false;
    }
    
    public async getUser(userId:string): Promise<User|undefined> {
        return await ServerFacade.getUserById(userId);
    }

    public async updateUser(user: User) {
        return await ServerFacade.updateUser(user);
    }
}