import User from "../../../react-native-app/shared/models/User";
import {UserSearchRequest, UserSearchResponse} from "../../../react-native-app/shared/models/requests/UserSearchRequest";
import Login from "../../../react-native-app/shared/models/Login";
import SignUp from "../../../react-native-app/shared/models/SignUp";

export default interface UserDao {
    login(data: Login): Promise<User|undefined>;
    signUp(data: SignUp): Promise<any>;
    createUser(data:User);
    updateUser(data: User);
    getUser(id:string): Promise<User|undefined>;
    search(request:UserSearchRequest): Promise<UserSearchResponse>;
    deleteUser(id:string): void;
}