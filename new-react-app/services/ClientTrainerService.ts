import RelationshipStatus from "../../shared/constants/RelationshipStatus";
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";

export default class ClientTrainerService {
    public async getTrainerStatus(trainer:User,user:User): Promise<RelationshipStatus> {
        return await ServerFacade.getTrainerStatus(trainer,user);
    }
    
    public async getUserTrainer(userId:string): Promise<User|null> {
        return await ServerFacade.getUserTrainer(userId);
    }
    
    public async getUserClients(userId:string): Promise<User[]> {
        return await ServerFacade.getUserClients(userId);
    }
    
    public async getTrainerRequestsByTrainer(trainerId:string): Promise<User[]> {
        return await ServerFacade.getTrainerRequestsByTrainer(trainerId);
    }
    
    public async requestTrainerForClient(trainer:User,client:User) {
        await ServerFacade.requestTrainerForClient(trainer,client);
    }
    public async cancelTrainerRequest(trainer:User,client:User) {
        await ServerFacade.cancelTrainerRequest(trainer,client);
    }
    public async approveClient(trainer:User,client:User) {
        await ServerFacade.approveClient(trainer,client);
    }

    public async removeTrainerFromClient(trainer:User,client:User) {
        await ServerFacade.removeTrainerFromClient(trainer,client);
    }
}