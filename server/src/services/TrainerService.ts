import { PrismaClient } from "@prisma/client";
import { trace } from "console";
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import TrainerClientPair from "../../../react-native-app/shared/models/TrainerClientPair";
import User from "../../../react-native-app/shared/models/User";
import UserService from "./UserService";

const prisma = new PrismaClient();

export default class TrainerService {

    async getRelationshipStatus(pair: TrainerClientPair): Promise<RelationshipStatus> {
        let pending = await prisma.trainerClientRequest.findUnique({
			where: { trainerId_clientId: pair },
		});
        if (pending) return RelationshipStatus.PENDING;
        let approved = await prisma.trainerClientPair.findUnique({
			where: { trainerId_clientId: pair }
		});
        if (approved) return RelationshipStatus.APPROVED;

        return RelationshipStatus.NONEXISTENT;
    }


    //
    // REQUESTS
    //

    async requestTrainer(data: TrainerClientPair) {
		await prisma.trainerClientRequest.create({
			data
		});
    }

    async deleteTrainerRequest(data: TrainerClientPair) {
		await prisma.trainerClientRequest.delete({
			where: { trainerId_clientId: data }
		})
    }
    
    async getRequestsByClient(userId:string):Promise<TrainerClientPair[]> {
		return await prisma.trainerClientRequest.findMany({
			where: { clientId: userId }
		})
    }
    
    async getRequestsByTrainer(userId:string):Promise<User[]> {
		let pairs = await prisma.trainerClientRequest.findMany({
			where: { trainerId: userId }
		});
        let requesters: User[] = [];
        await Promise.all(pairs.map(async (pair)=>{
            let user = await new UserService().getUser(pair.clientId);
            if (user) requesters.push(user)
        }))
        return requesters;
    }

    //
    // APPROVED CONNECTIONS
    //

    async approveTrainerRequest(request: TrainerClientPair) {
        // wait for successsful creation before removing request to catch errors
		await prisma.trainerClientPair.create({
			data: request
		})
		await prisma.trainerClientRequest.delete({
			where: { trainerId_clientId: request }
		})
    }
    
    async removeTrainerFromClient(data: TrainerClientPair) {
		await prisma.trainerClientPair.delete({
			where: { trainerId_clientId: data }
		})
    }
    
    async getClientsOfTrainer(userId:string):Promise<User[]> {
		let pairs = await prisma.trainerClientPair.findMany({
			where: { trainerId: userId }
		});
		let clients: User[] = [];
        await Promise.all(pairs.map(async (pair) => {
            let user = await await new UserService().getUser(pair.clientId)
            if (user) clients.push(user)
        }))
        return clients;
    }
    
    async getTrainerOfClient(userId:string):Promise<User|undefined> {
		let pair = await prisma.trainerClientPair.findFirst({
			where: { clientId: userId }
		})
		if (!pair) return;
        return await new UserService().getUser(pair.trainerId);
    }


}