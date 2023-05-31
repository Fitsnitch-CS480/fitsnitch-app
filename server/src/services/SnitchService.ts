import SnitchEvent from "../../../react-native-app/shared/models/SnitchEvent";
import { UserSnitchesRequest, UserSnitchesResponse } from "../../../react-native-app/shared/models/requests/UserSnitchesRequest";
import { GetSnitchRequest } from "../../../react-native-app/shared/models/requests/GetSnitchRequest";
import { CreateSnitchRequest } from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import PartnerAssociationService from './PartnerAssociationService';
import TrainerService from './TrainerService';
import PushNotificationService, { PresetOptions } from './PushNotificationService';
import UserService from './UserService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class SnitchService {
	async createAndPublishSnitch(newSnitchData: CreateSnitchRequest) {
		try {
			console.log(newSnitchData)
			await this.createSnitch(newSnitchData)
		}
		catch (e) {
			console.log("Error creating Snitch:", e);
			throw new Error("Could not create Snitch");
		}

		// TODO - Unghetto this. Can a partner of a user be their trainer also? If yes, make sure to not have duplicates https://megafauna.dev/remove-duplicate-array-values-javascript/#:~:text=%208%20Ways%20to%20Remove%20Duplicate%20Array%20Values,from%20an%20Array%20Using%20.forEach%20%28%29%0ADe-duplication...%20More%20 
		// This is getting all the userIds related to our User that was Snitched on
		let relatedUsersList = await new PartnerAssociationService().getPartnersOfUser(newSnitchData.userId)
		console.log("Related Users List is: ", relatedUsersList);

		let trainer = await new TrainerService().getTrainerOfClient(newSnitchData.userId)
		if (trainer != undefined) {
			console.log("Trainer is: ", relatedUsersList);
			relatedUsersList.push(trainer)
		}

		// TODO - This is a string[] right now but we want to make a model. Check TODO on pushSnitchNotification
		let pushSnitchNotificationList: string[] = [];

		relatedUsersList.forEach(element => {
			pushSnitchNotificationList.push(element.userId)
		});

		const snitchOnUser = await new UserService().getUser(newSnitchData.userId);

		let response = await PushNotificationService.sendMessageToUsers(
			pushSnitchNotificationList,
			{
				notification: {
					title: `${snitchOnUser?.firstname} Needs Help!`,
					body: `Reach out to help them meet their goals.`,
				},
			},
			{ ...PresetOptions.HighPriority }
		);
		console.log("Response is ", response);
	}

	/**
	 * Creates a new Snitch. Handles saving the snitches datetime
	 * so that it can be mroe reliable than a users phone
	 * @param data Just the data required to create a new Snitch
	 */
	async createSnitch(data: CreateSnitchRequest): Promise<SnitchEvent> {
		let snitch = new SnitchEvent(data.userId, new Date().toISOString(), data.originCoords, data.restaurantData)
		await prisma.snitchEvent.create({
			data: this.typeToDb(snitch)
		})
		return snitch;
	}

	async updateSnitch(data: SnitchEvent) {
		await prisma.snitchEvent.update({
			where: {
				snitchId: data.snitchId,
			},
			data: this.typeToDb(data)
		})
	}

	async getSnitch(request: GetSnitchRequest): Promise<SnitchEvent | null> {
		return this.dbToType(await prisma.snitchEvent.findUnique({
			where: { snitchId: request.snitchId }
		}))
	}

	async getUserSnitches(request: UserSnitchesRequest): Promise<UserSnitchesResponse> {
		const page = request.pageNumber || 0;
		const pageSize = request.pageSize || 20;
		let total = await prisma.snitchEvent.count({ where: { userId: { in: request.userIds } } });
		let snitches = await prisma.snitchEvent.findMany({
			where: { userId: { in: request.userIds } },
			skip: page * pageSize,
			take: request.pageSize,
			orderBy: {
				created_at: 'desc'
			}
		});
		return new UserSnitchesResponse(snitches.map(s => this.dbToType(s)), pageSize, page, total);
	}

	async switchSnitchToCheatmeal(data: SnitchEvent) {
		const snitch = this.typeToDb(data);
		const meal = {
			...snitch,
		}
		delete meal.snitchId;
		await prisma.cheatMealEvent.create({ data: meal})
		await prisma.snitchEvent.delete({ where: { snitchId: data.snitchId } })
	}

	async deleteSnitch(data: SnitchEvent) {
		await prisma.snitchEvent.delete({ where: { snitchId: data.snitchId } })
	}

	// Temporary methods because the previous types don't don't exactly match the SQL schema
	typeToDb(typeData: SnitchEvent) {
		return {
			snitchId: typeData.snitchId,
			userId: typeData.userId,
			created_at: typeData.created_at,
			lat: typeData.originCoords.lat,
			lon: typeData.originCoords.lon,
			restaurantName: typeData.restaurantData.name || '',
			restaurantLat: typeData.restaurantData.location?.lat || 0,
			restaurantLon: typeData.restaurantData.location?.lon || 0,
		}
	}

	dbToType(dbData): SnitchEvent {
		return {
			userId: dbData.userId,
			restaurantData: {
				name: dbData.restaurantName,
				location: {
					lat: dbData.restaurantLat,
					lon: dbData.restaurantLon,
				},
			},
			originCoords: {
				lat: dbData.lat,
				lon: dbData.lon,
			},
			created_at: dbData.created_at,
			snitchId: dbData.snitchId,
		}
	}
}