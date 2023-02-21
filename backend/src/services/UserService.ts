import { UserSearchRequest, UserSearchResponse } from "../../../react-native-app/shared/models/requests/UserSearchRequest";
import User from "../../../react-native-app/shared/models/User";
import Login from "../../../react-native-app/shared/models/Login";
import SignUp from "../../../react-native-app/shared/models/SignUp";
import DaoFactory from "../db/DaoFactory";

export default class UserService {

    async login(data:Login):Promise<User|undefined> {
        return await DaoFactory.getUserDao().login(data);
    }

    async signUp(data: SignUp):Promise<User|undefined> {
        return await DaoFactory.getUserDao().signUp(data);
    }

    async createUser(data: User) {
        await DaoFactory.getUserDao().createUser(data);
    }

    async updateUser(data: User) {
        await DaoFactory.getUserDao().updateUser(data);
    }

    async search(request:UserSearchRequest): Promise<UserSearchResponse> {
        return await DaoFactory.getUserDao().search(request);
    }

    async getUser(id: string): Promise<User|undefined> {
        return await DaoFactory.getUserDao().getUser(id);
    }
    
    async getExistingUsers(ids: string[]): Promise<User[]> {
        let dao = DaoFactory.getUserDao();        
        let users: User[] = [];
        await Promise.all(ids.map(async id=>{
            let user = await dao.getUser(id)
            if (user) users.push(user)
        }))
        return users;
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