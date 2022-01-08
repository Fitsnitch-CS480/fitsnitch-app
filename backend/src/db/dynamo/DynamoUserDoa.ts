import User from "../../../../shared/models/User";
import UserDAO from "../UserDAO";
import TableAccessObject from "./TableAccessObject";

export default class DynamoUserDao implements UserDAO {
    private userTable = new TableAccessObject<User>("Users","userId");
    
    async createUser(data: User) {
        await this.userTable.create(data);
    }

    async getUser(id: string): Promise<User|undefined> {
        return await this.userTable.getByPrimaryKey(id)
    }
}