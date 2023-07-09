import { observer } from "mobx-react-lite";
import React, { createContext, ReactNode, useState } from "react";
import User from "../shared/models/User";
// import LocationStore from "../stores/LocationStore";
import LogStore from "../stores/LogStore";
import { ClientStore, PartnerStore, TrainerStore } from "../stores/PeopleStores";
import { PartnerRequestForUserStore, TrainerRequestForUserStore } from "../stores/RequestStores";
import UserStore from "../stores/UserStore";

type props = {
	authUser?: User,
	children: ReactNode
}

export var globalContext: React.Context<{
	setCurrentUser: (User)=>void,
	userStore: UserStore,
	logStore: LogStore,
	partnerStore: PartnerStore,
	clientStore: ClientStore,
	trainerStore: TrainerStore,
	trainerRequestsForUser: TrainerRequestForUserStore,
	partnerRequestsForUser: PartnerRequestForUserStore,
}>;

export const GlobalContextProvider = observer<props>(({ children }) => {
	const userStore = new UserStore();
	const logStore = new LogStore();
	const partnerStore = new PartnerStore();
	const clientStore = new ClientStore();
	const trainerStore = new TrainerStore();
	const trainerRequestsForUser = new TrainerRequestForUserStore();
	const partnerRequestsForUser = new PartnerRequestForUserStore();
	
	const setCurrentUser = (user) => {
		userStore.setUser(user);
		partnerStore.setUser(user);
		clientStore.setUser(user);
		trainerStore.setUser(user);
		trainerRequestsForUser.setUser(user);
		partnerRequestsForUser.setUser(user);
	};

	const gCtx = {
		setCurrentUser,
		userStore,
		logStore,
		partnerStore,
		clientStore,
		trainerStore,
		trainerRequestsForUser,
		partnerRequestsForUser,
	}

	globalContext = createContext(gCtx)

	return (
		<globalContext.Provider value={gCtx}>
			{children}
		</globalContext.Provider>
	);
})
