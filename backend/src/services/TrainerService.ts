import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import TrainerClientPair from "../../../react-native-app/shared/models/TrainerClientPair";
import DaoFactory from "../db/DaoFactory";

export default class TrainerService {

    async getRelationshipStatus(pair: TrainerClientPair): Promise<RelationshipStatus> {
        let pending = await DaoFactory.getTrainerRequestDao().existsRequest(pair);
        if (pending) return RelationshipStatus.PENDING;
        let approved = await DaoFactory.getTrainersDao().isTrainerOfClient(pair);
        if (approved) return RelationshipStatus.APPROVED;

        return RelationshipStatus.NONEXISTENT;
    }


    //
    // REQUESTS
    //

    async requestTrainer(data: TrainerClientPair) {
        await DaoFactory.getTrainerRequestDao().createTrainerRequest(data);
    }

    async deleteTrainerRequest(data: TrainerClientPair) {
        await DaoFactory.getTrainerRequestDao().deleteTrainerRequest(data);
    }
    
    async getRequestsByClient(userId:string):Promise<TrainerClientPair[]> {
        return await DaoFactory.getTrainerRequestDao().getRequestsByClient(userId);
    }
    
    async getRequestsByTrainer(userId:string):Promise<TrainerClientPair[]> {
        return await DaoFactory.getTrainerRequestDao().getRequestsByTrainer(userId);
    }

    //
    // APPROVED CONNECTIONS
    //

    async approveTrainerRequest(request: TrainerClientPair) {
        // wait for successsful creation before removing request to catch errors
        await DaoFactory.getTrainersDao().assignTrainerToClient(request);
        await DaoFactory.getTrainerRequestDao().deleteTrainerRequest(request);
    }
    
    async removeTrainerFromClient(data: TrainerClientPair) {
        await DaoFactory.getTrainersDao().removeTrainerFromClient(data);
    }
    
    async getClientIdsOfTrainer(userId:string):Promise<string[]> {
        return await DaoFactory.getTrainersDao().getClientIdsOfTrainer(userId);
    }
    
    async getTrainerIdOfClient(userId:string):Promise<string> {
        return await DaoFactory.getTrainersDao().getTrainerIdOfClient(userId);
    }


}