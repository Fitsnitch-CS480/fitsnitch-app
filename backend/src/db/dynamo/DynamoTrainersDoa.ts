import TrainerClientPair from "../../../../shared/models/TrainerClientPair";
import TrainersDAO from "../TrainersDAO";
import TableAccessObject, { SortOp } from "./TableAccessObject";

export default class DynamoTrainersDao implements TrainersDAO {
    private table = new TableAccessObject<TrainerClientPair>("TrainerClientAssociations","trainerId","clientId");
    private reverseIndex = new TableAccessObject<TrainerClientPair>("clientId-trainerId-index","clientId","trainerId");

    async assignTrainerToClient(trainerId: string, clientId: string) {
        throw new Error("Method not implemented.");
    }
    
    async isTrainerOfClient(trainerId: string, clientId: string): Promise<boolean> {
        let pairs = await this.table.query(trainerId, SortOp.EQUALS, clientId);
        if (pairs.length === 0) return false;
        else return pairs[0].trainerId === trainerId && pairs[0].clientId === clientId;
    }
    
    async getClientIdsOfTrainer(trainerId: string): Promise<string[]> {
        let pairs = await this.table.query(trainerId);
        return pairs.map(p=>p.clientId);
    }
    
    async getTrainerIdOfClient(clientId: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
}