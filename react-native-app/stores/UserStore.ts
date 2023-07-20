import EncryptedStorage from 'react-native-encrypted-storage';

import { observable, action, computed, makeObservable } from "mobx";
import User from '../shared/models/User';


type Storage = null | {
	didFirstLaunch?: Boolean,
	acceptedLocation?: boolean,
}

export default class UserStore {
    constructor() {
	    makeObservable(this);
    }

	@observable currentUser;
	@observable _cachedStorage: Storage = null;

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
		this._cachedStorage = null;
		await this._loadUserStorage();
	}

	@action
	async _loadUserStorage() {
		if (!this.currentUser) {
			console.log("No current user. Removing user storage.");
			this._cachedStorage = null;
			return;
		}
		let newStorage;
		try {
			const storage = this._unstringify(await EncryptedStorage.getItem(this._userStorageKey));
			newStorage = storage || {};
		} catch (error) {
			console.log('Could not get user storage.', error)
			newStorage = null;
		}
		this._cachedStorage = newStorage;
		return newStorage;
	}

	get userStorage() {
		return this._cachedStorage;
	}

	@action async updateUserStorage(props:Storage) {
		if (!props) return;
		console.log("Updating user storage", this._userStorageKey, props)
		try {
			await EncryptedStorage.setItem(
				this._userStorageKey,
				JSON.stringify({
					...(this._cachedStorage || {}),
					...props,
				})
			);
			await this._loadUserStorage();
		} catch (error) {
			console.log('Could not get user storage.', error)
		}
		return this._cachedStorage;
	}
}
