import User from "../../../../shared/models/User";
import UserDao from "../UserDao";
import TableAccessObject from "./TableAccessObject";

export default class DynamoUserDao implements UserDao {
    private userTable = new TableAccessObject<User>("Users","userId");
    
    async createUser(data: User) {
        await this.userTable.createOrUpdate(data);
    }

    async getUser(id: string): Promise<User|undefined> {
        return await this.userTable.getByPrimaryKey(id)
    }

    async updateUser(data: User) {
        throw new Error("Method not implemented.");
    }

    async deleteUser(id: string) {
        throw new Error("Method not implemented.");
    }
}