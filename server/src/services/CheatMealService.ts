import { PrismaClient } from "@prisma/client";
import CheatMealEvent from "../../../react-native-app/shared/models/CheatMealEvent";
import { GetCheatMealRequest } from "../../../react-native-app/shared/models/requests/GetCheatMealRequest";
import { UserCheatMealRequest, UserCheatMealResponse } from "../../../react-native-app/shared/models/requests/UserCheatMealRequest";

const prisma = new PrismaClient();

export default class CheatMealService {
	async createCheatMeal(cheatMeal: CheatMealEvent): Promise<CheatMealEvent> {
		await prisma.cheatMealEvent.create({
			data: this.typeToDb(cheatMeal)
		})
		return cheatMeal;
	}

	async updateCheatMeal(data: CheatMealEvent) {
		await prisma.cheatMealEvent.update({
			where: {
				cheatMealId: data.cheatMealId,
			},
			data: this.typeToDb(data)
		})
	}

	async getCheatMeals(request: GetCheatMealRequest): Promise<CheatMealEvent[]> {
		let meals = await prisma.cheatMealEvent.findMany({
			where: {
				userId: request.userId,
				created_at: { lte: request.periodStart },
			},
		});
		return meals.map(m => this.dbToType(m));
	}

	async getUserCheatMeals(request: UserCheatMealRequest): Promise<UserCheatMealResponse> {
		const page = request.pageNumber || 0;
		const pageSize = request.pageSize || 20;
		let total = await prisma.cheatMealEvent.count({ where: { userId: request.userId } });
		let meals = await prisma.cheatMealEvent.findMany({
			where: { userId: request.userId },
			skip: page * pageSize,
			take: request.pageSize,
			orderBy: {
				created_at: 'desc'
			}
		});
		return new UserCheatMealResponse(meals.map(s => this.dbToType(s)), page, pageSize, total);
	}

	async deleteCheatMeal(data: CheatMealEvent) {
		await prisma.cheatMealEvent.delete({ where: { cheatMealId: data.cheatMealId } })
	}


	// Temporary methods because the previous types don't don't exactly match the SQL schema
	typeToDb(typeData: CheatMealEvent) {
		return {
			cheatMealId: typeData.cheatMealId,
			userId: typeData.userId,
			created_at: typeData.created_at,
			lat: typeData.originCoords.lat,
			lon: typeData.originCoords.lon,
			restaurantName: typeData.restaurantData.name || '',
			restaurantLat: typeData.restaurantData.location?.lat || 0,
			restaurantLon: typeData.restaurantData.location?.lon || 0,
		}
	}

	dbToType(dbData): CheatMealEvent {
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
			cheatMealId: dbData.cheatMealId,
		}
	}
}