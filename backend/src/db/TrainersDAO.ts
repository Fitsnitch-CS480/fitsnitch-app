import TrainerClientPair from "../../../shared/models/TrainerClientPair";

export default interface TrainersDao {
    assignTrainerToClient(data:TrainerClientPair);
    isTrainerOfClient(data:TrainerClientPair): Promise<boolean>;
    getClientIdsOfTrainer(trainerId:string): Promise<string[]>;
    getTrainerIdOfClient(clientId:string): Promise<string>;
    removeTrainerFromClient(data:TrainerClientPair);
}