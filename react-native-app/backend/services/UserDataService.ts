import User from "../../shared/models/User";

export default class UserDataService {
    public async isUserTrainerOfUser(trainer:User,user:User): Promise<boolean> {
        // TODO: implement with serverfacade
        return false;
    }
    public async isUserPartnerOfUser(partner:User,user:User): Promise<boolean> {
        // TODO: implement with serverfacade
        return false;
    }
}