import TrainerClientPair from "../../../../shared/models/TrainerClientPair";
import TrainersDao from "../TrainersDao";
import TableAccessObject, { SortOp } from "./TableAccessObject";

export default class DynamoTrainersDao implements TrainersDao {
    private table = new TableAccessObject<TrainerClientPair>("TrainerClientAssociations","trainerId","clientId");
    private reverseIndex = new TableAccessObject<TrainerClientPair>("clientId-trainerId-index","clientId","trainerId");

    async assignTrainerToClient(data:TrainerClientPair) {
        // TODO
        throw new Error("Method not implemented.");
    }
    
    async isTrainerOfClient(pair:TrainerClientPair): Promise<boolean> {
        let pairs = await this.table.query(pair.trainerId, SortOp.EQUALS, pair.clientId);
        if (pairs.length === 0) return false;
        else return true;
    }
    
    async getClientIdsOfTrainer(trainerId: string): Promise<string[]> {
        let pairs = await this.table.query(trainerId);
        return pairs.map(p=>p.clientId);
    }
    
    async getTrainerIdOfClient(clientId: string): Promise<string> {
        // TODO
        throw new Error("Method not implemented.");
    }
    
    async removeTrainerFromClient(data: TrainerClientPair) {
        // TODO
        throw new Error("Method not implemented.");
    }
}