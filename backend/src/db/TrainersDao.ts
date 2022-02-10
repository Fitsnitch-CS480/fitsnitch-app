import TrainerClientPair from "../../../react-native-app/shared/models/TrainerClientPair";
import User from "../../../react-native-app/shared/models/User";

export default interface TrainersDao {
    assignTrainerToClient(data:TrainerClientPair);
    isTrainerOfClient(data:TrainerClientPair): Promise<boolean>;
    getClientIdsOfTrainer(trainerId:string): Promise<string[]>;
    getTrainerIdOfClient(clientId:string): Promise<string>;
    removeTrainerFromClient(data:TrainerClientPair);
}