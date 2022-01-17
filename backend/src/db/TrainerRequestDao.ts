import TrainerClientPair from "../../../shared/models/TrainerClientPair";

export default interface TrainerRequestDao {
    createTrainerRequest(data:TrainerClientPair);
    deleteTrainerRequest(data:TrainerClientPair);

    /**
     * Finds all requests where this userId is the Trainer
     * @param userId 
     */
    getRequestsByTrainer(userId:string): Promise<TrainerClientPair[]>;

    /**
     * Finds all requests where this userId is the Client
     * @param userId 
     */
    getRequestsByClient(userId:string): Promise<TrainerClientPair[]>;

    /**
     * Used when wiping a user's data. Removes any request with userId
     * @param userId 
     */
    deleteAllUserRequests(userId:string);
}