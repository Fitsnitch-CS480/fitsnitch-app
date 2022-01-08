import TrainerClientPair from "../../../shared/models/TrainerClientPair";

export default interface TrainersDAO {
    assignTrainerToClient(trainerId:string,clientId:string);
    isTrainerOfClient(trainerId:string,clientId:string): Promise<boolean>;
    getClientIdsOfTrainer(trainerId:string): Promise<string[]>;
    getTrainerIdOfClient(clientId:string): Promise<string>;
}