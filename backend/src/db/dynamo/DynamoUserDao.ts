import User from "../../../../react-native-app/shared/models/User";
import UserDao from "../UserDao";
import TableAccessObject from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoUserDao implements UserDao {
    private schema = DB_TABLES.USERS;
    private userTable = new TableAccessObject<User>(this.schema);
    
    async createUser(data: User) {
        await this.userTable.createOrUpdate(data);
    }

    async getUser(id: string): Promise<User|undefined> {
        return await this.userTable.getByPrimaryKey(id)
    }

    async updateUser(data: User) {
        await this.userTable.createOrUpdate(data);
    }

    async deleteUser(id: string) {
        throw new Error("Method not implemented.");
    }
}