import { DeviceToken, PendingUser, PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient();

const UserService = {
	// Pending Users
    async createPendingUser(data: PendingUser) {
        await prisma.pendingUser.create({
			data,
		})
	},

    async deletePendingUser(pendingUserId: string) {
        await prisma.pendingUser.delete({
			where: { pendingUserId },
		})
	},

    async getPendingUser(pendingUserId: string) {
        return await prisma.pendingUser.findUnique({
			where: { pendingUserId },
		})
	},

    async changePendingToUser(pendingUser: PendingUser): Promise<User> {
		const userData: any = {
			...pendingUser,
			userId: pendingUser.pendingUserId,
			image: null,
			cheatmealSchedule: null,
		};
		delete userData.pendingUserId;
        const user = await this.createUser(userData as User);
		await this.deletePendingUser(pendingUser.pendingUserId);
		return user;
	},

	// Real Users
    async createUser(data: User): Promise<User> {
       return await prisma.user.create({
			data,
		})
	},

    async updateUser(data: User) {
        await prisma.user.update({
			where: { userId: data.userId },
			data,
		})
    },

    async search(query, pageSize = 20, page = 0) {
		const terms = query.split(' ').join(' | ');
		const where = {
			OR: [
				{ firstname: { search: terms, } },
				{ lastname: { search: terms, } },
			],
		};
		const total = await prisma.user.count({ where });
        const users = await prisma.user.findMany({
			where,
			take: pageSize,
			skip: pageSize * page
		});
		return { users, total };
    },

    async getUser(id: string): Promise<any> {
		return await prisma.user.findUnique({
			where: { userId: id }
		});
    },
	
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
    },

    async getUserTokens(userId: string): Promise<DeviceToken[]> {
        return await prisma.deviceToken.findMany({
			where: {
				userId
			},
		})
    },
    
    async getExistingUsers(ids: string[]): Promise<User[]> {
        let users: User[] = [];
        await Promise.all(ids.map(async id=>{
            let user = await this.getUser(id)
            if (user) users.push(user as any)
        }))
        return users;
    },

    /**
     * Handles removing all user data upon account deletion
     * @param id
     */
    async wipeUserData(id: string) {
    //  TODO
        throw new Error("Not yet implemented!")
    },
}

export default UserService;
