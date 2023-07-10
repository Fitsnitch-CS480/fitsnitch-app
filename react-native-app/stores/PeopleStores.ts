import { action, makeObservable } from "mobx";
import ServerFacade from "../services/ServerFacade";
import User from "../shared/models/User";
import CacheStore from "./CacheStore";

export class PartnerStore extends CacheStore<User[]> {
    private currentUser;

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
        return await ServerFacade.getUserPartners(this.currentUser.userId);
    }

    @action isPartnerOfUser(otherUserId) {
        return this._data.some(u=>u.userId===otherUserId)
    }
}


export class ClientStore extends CacheStore<User[]> {
    private currentUser;

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
        return await ServerFacade.getUserClients(this.currentUser.userId);
    }

    @action isClientOfUser(otherUserId) {
        return this._data.some(u=>u.userId===otherUserId)
    }
}


export class TrainerStore extends CacheStore<User|null> {
    private currentUser;

    constructor(user = null) {
        super(null)
	    makeObservable(this)
		if (user) {
			this.setUser(user);
		}
    }

	@action setUser(user: User) {
		this.currentUser = user;
		this.getData();
	}

    async getData(): Promise<User|null> {
		if (!this.currentUser) return null;
        return await ServerFacade.getUserTrainer(this.currentUser.userId);
    }

}
