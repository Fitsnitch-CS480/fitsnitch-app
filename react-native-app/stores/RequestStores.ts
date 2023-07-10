import { action, makeObservable } from "mobx";
import ServerFacade from "../services/ServerFacade";
import User from "../shared/models/User";
import CacheStore from "./CacheStore";

/**
 * Stores requests to train with the current user
 */
export class TrainerRequestForUserStore extends CacheStore<User[]> {
    currentUser;

    constructor(user = null) {
        super([])
	    makeObservable(this)
		if (user) {
			this.setUser(user);
		}
    }

	@action setUser(user: User) {
		this.currentUser = user;
		this.getData();
	}

    @action async getData(): Promise<User[]> {
		if (!this.currentUser) return [];
        return await ServerFacade.getTrainerRequestsByTrainer(this.currentUser.userId);
    }
}


/**
 * Stores requests to partner up with the current user
 */
export class PartnerRequestForUserStore extends CacheStore<User[]> {
    currentUser;

    constructor(user = null) {
        super([])
	    makeObservable(this)
		if (user) {
			this.setUser(user);
		}
    }

	@action setUser(user: User) {
		this.currentUser = user;
		this.getData();
	}

    async getData(): Promise<User[]> {
		if (!this.currentUser) return [];
        return await ServerFacade.getPartnerRequesters(this.currentUser.userId);
    }
}
