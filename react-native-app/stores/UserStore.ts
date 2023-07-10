import EncryptedStorage from 'react-native-encrypted-storage';

import { observable, action, computed, makeObservable } from "mobx";
import User from '../shared/models/User';

const defaultStorage = {
	acceptedLocation: false,
}

export default class UserStore {
    constructor() {
	    makeObservable(this);
    }

	@observable currentUser;
	@observable _cachedStorage = { ...defaultStorage };

	@action setUser(user: User) {
		this.currentUser = user;
		this._init();
	}

	get _userStorageKey() {
		if (!this.currentUser.userId) {
			throw new Error("Storage must be initialized with a User ID!");
		}
		return `user_storage_${this.currentUser.userId}`;
	}

	_unstringify(json) {
		return JSON.parse(json || "null");
	}

	async _init() {
		await this._loadUserStorage();
	}

	@action
	async _loadUserStorage() {
		try {
			const storage = this._unstringify(await EncryptedStorage.getItem(this._userStorageKey));
			this._cachedStorage = storage || { ... defaultStorage };
			return this._cachedStorage;
		} catch (error) {
			console.log('Could not get user storage.', error)
			return this._cachedStorage;
		}
	}

	get userStorage() {
		return this._cachedStorage;
	}

	@action async updateUserStorage(props) {
		try {
			await EncryptedStorage.setItem(
				this._userStorageKey,
				JSON.stringify({
					... this._cachedStorage,
					... props,
				})
			);
			await this._loadUserStorage();
			return this._cachedStorage;
		} catch (error) {
			console.log('Could not get user storage.', error)
			return this._cachedStorage;
		}
	}
}
