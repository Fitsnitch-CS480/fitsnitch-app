import TrainerClientPair from "../../../../react-native-app/shared/models/TrainerClientPair";
import TrainerRequestDao from "../TrainerRequestDao";
import TableAccessObject from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoTrainerRequestDao implements TrainerRequestDao {
    private table = new TableAccessObject<TrainerClientPair>(DB_TABLES.TRAINER_REQUESTS);
    private clientIndex = this.table.createIndexAccessObject(DB_TABLES.TRAINER_REQUESTS_BY_CLIENT);
    
    async createTrainerRequest(data: TrainerClientPair) {
        await this.table.createOrUpdate(data);
    }

    // fat arrow funtion to preserve this context
    deleteTrainerRequest = async (request: TrainerClientPair) => {
        return await this.table.deleteByKeys(request.trainerId,request.clientId);
    }

    async getRequestsByTrainer(trainerId: string): Promise<TrainerClientPair[]> {
        return await this.table.query(trainerId);
    }

    async getRequestsByClient(clientId: string): Promise<TrainerClientPair[]> {
        return await this.clientIndex.query(clientId);
    }

    // For wiping data
    async deleteAllUserRequests(personId: string) {
        await Promise.all([
            // Find and delete all requests to follow user
            (async ()=>{
                let reqs = await this.getRequestsByClient(personId);
                await Promise.all(reqs.map(this.deleteTrainerRequest));
            })(),
            
            // Find and delete all follow requests from user
            (async ()=>{
                let reqs = await this.getRequestsByTrainer(personId);
                await Promise.all(reqs.map(this.deleteTrainerRequest));
            })(),
        ])
    }
}