import { action, makeObservable } from "mobx";
import ServerFacade from "../backend/ServerFacade";
import User from "../shared/models/User";
import CacheStore from "./CacheStore";

/**
 * Stores requests to train with the current user
 */
export class TrainerRequestForUserStore extends CacheStore<User[]> {
    currentUser: User;

    constructor(user:User) {
        super([])
        this.currentUser = user;
	    makeObservable(this)
    }

    @action async getData(): Promise<User[]> {
        return await ServerFacade.getTrainerRequestsByTrainer(this.currentUser.userId);
    }
}


/**
 * Stores requests to partner up with the current user
 */
export class PartnerRequestForUserStore extends CacheStore<User[]> {
    currentUser: User;

    constructor(user:User) {
        super([])
        this.currentUser = user;
	    makeObservable(this)
    }

    async getData(): Promise<User[]> {
        return await ServerFacade.getPartnerRequesters(this.currentUser.userId);
    }
}
