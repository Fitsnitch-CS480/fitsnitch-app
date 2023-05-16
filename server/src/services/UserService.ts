import { UserSearchRequest, UserSearchResponse } from "../../../react-native-app/shared/models/requests/UserSearchRequest";
import DaoFactory from "../db/DaoFactory";

import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient();

export default class UserService {
    async createUser(data: User) {
        await prisma.user.create({
			data,
		})
	}

    async updateUser(data: User) {
        await prisma.user.update({
			where: { userId: data.userId },
			data,
		})
    }

    async search(request:UserSearchRequest): Promise<UserSearchResponse> {
        return await DaoFactory.getUserDao().search(request);
    }

    async getUser(id: string): Promise<any> {
		return await prisma.user.findFirst({
			where: { userId: id }
		});
    }
	
    async addDeviceToken(userId: string, token: string) {
        await prisma.deviceToken.upsert({
			where: {
				userId_token: { userId, token }
			},
			update: {
				userId,
				token
			},
			create: {
				userId,
				token,
			}
		})
    }
    
    async getExistingUsers(ids: string[]): Promise<User[]> {
        let dao = DaoFactory.getUserDao();        
        let users: User[] = [];
        await Promise.all(ids.map(async id=>{
            let user = await dao.getUser(id)
            if (user) users.push(user as any)
        }))
        return users;
    }

    /**
     * Handles removing all user data upon account deletion
     * @param id
     */
    async wipeUserData(id: string) {
    //  TODO
        throw new Error("Not yet implemented!")
    }
}
