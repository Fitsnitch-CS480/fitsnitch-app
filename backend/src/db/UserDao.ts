import User from "../../../react-native-app/shared/models/User";
import {UserSearchRequest, UserSearchResponse} from "../../../react-native-app/shared/models/requests/UserSearchRequest";
import Login from "../../../react-native-app/shared/models/Login";
import SignUp from "../../../react-native-app/shared/models/SignUp";
import Confirmation from "../../../react-native-app/shared/models/Confirmation";

export default interface UserDao {
    login(data: Login): Promise<User|undefined>;
    signUp(data: SignUp): Promise<any>;
    logout(username: string): void;
    confirmSignUp(data: Confirmation): Promise<User|undefined>;
    resendConfirmation(username: string): void;
    createUser(data:User);
    updateUser(data: User);
    getUser(id:string): Promise<User|undefined>;
    search(request:UserSearchRequest): Promise<UserSearchResponse>;
    deleteUser(id:string): void;
}