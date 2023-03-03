import User from "../../../react-native-app/shared/models/User";
import {UserSearchRequest, UserSearchResponse} from "../../../react-native-app/shared/models/requests/UserSearchRequest";

export default interface UserDao {
    createUser(data:User);
    updateUser(data: User);
    getUser(id:string): Promise<User|undefined>;
    search(request:UserSearchRequest): Promise<UserSearchResponse>;
    deleteUser(id:string): void;
}