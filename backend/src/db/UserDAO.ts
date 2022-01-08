import User from "../../../shared/models/User";

export default interface UserDAO {
    createUser(data:User);
    getUser(id:string): Promise<User|undefined>;
}