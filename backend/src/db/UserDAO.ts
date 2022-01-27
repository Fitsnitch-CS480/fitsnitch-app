import User from "../../../react-native-app/shared/models/User";

export default interface UserDao {
    createUser(data:User);
    updateUser(data: User);
    getUser(id:string): Promise<User|undefined>;
    deleteUser(id:string): void;
}