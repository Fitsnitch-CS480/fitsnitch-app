import User from "../../../shared/models/User";
import DaoFactory from "../db/DaoFactory";

export default class UserService {
    async createUser(data: User) {
        await DaoFactory.getUserDao().createUser(data);
    }

    async updateUser(data: User) {
        await DaoFactory.getUserDao().updateUser(data);
    }

    async getUser(id: string): Promise<User|undefined> {
        return await DaoFactory.getUserDao().getUser(id);
    }

    /**
     * Handles removing all user data upon account deletion
     * @param id
     */
    async wipeUserData(id: string) {
    //  TODO
        throw new Error("Not yet implementented!")
    }
}