import TrainerClientPair from "../../../../shared/models/TrainerClientPair";
import TrainersDao from "../TrainersDAO";
import TableAccessObject, { SortOp } from "./TableAccessObject";
import DB_TABLES from "./tables";

export default class DynamoTrainersDao implements TrainersDao {
    private table = new TableAccessObject<TrainerClientPair>(DB_TABLES.TRAINERS);
    private clientIndex = this.table.createIndexAccessObject(DB_TABLES.TRAINERS_INDEX_BY_CLIENTS);

    async assignTrainerToClient(data:TrainerClientPair) {
        // Make sure client does not already have a trainer
        let res = await this.clientIndex.query(data.clientId);
        if (res.length > 0) throw new Error("Client already has a trainer!");
        await this.table.createOrUpdate(data);
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
        let res = await this.clientIndex.query(clientId);
        if (res.length === 0) return "";
        else return res[0].trainerId;
    }
    
    async removeTrainerFromClient(data: TrainerClientPair) {
        await this.table.deleteByKeys(data.trainerId,data.clientId);
    }
}