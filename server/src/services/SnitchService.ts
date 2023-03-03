import { SwitchSnitchToCheatmealRequest } from '../../../react-native-app/shared/models/requests/SwitchSnitchToCheatmealRequest';
import SnitchEvent from "../../../react-native-app/shared/models/SnitchEvent";
import {UserSnitchesRequest, UserSnitchesResponse} from "../../../react-native-app/shared/models/requests/UserSnitchesRequest";
import {GetSnitchRequest} from "../../../react-native-app/shared/models/requests/GetSnitchRequest";
import {CreateSnitchRequest} from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import DaoFactory from "../db/DaoFactory";
import { APNSService } from "./APNSService";
import PartnerAssociationService from './PartnerAssociationService';
import TrainerService from './TrainerService';
import PushNotificationService, { PresetOptions } from './PushNotificationService';
import UserService from './UserService';

export default class SnitchService {
	async createAndPublishSnitch(newSnitchData: CreateSnitchRequest) {
		try {
			console.log(newSnitchData)
            await this.createSnitch(newSnitchData)
        }
        catch (e) {
            console.log("Error creating Snitch:", e);
            throw new Error("Could not create Snitch");
        }

        // TODO - Unghetto this. Can a partner of a user be their trainer also? If yes, make sure to not have duplicates https://megafauna.dev/remove-duplicate-array-values-javascript/#:~:text=%208%20Ways%20to%20Remove%20Duplicate%20Array%20Values,from%20an%20Array%20Using%20.forEach%20%28%29%0ADe-duplication...%20More%20 
        // This is getting all the userIds related to our User that was Snitched on
        let relatedUsersList = await new PartnerAssociationService().getPartnersOfUser(newSnitchData.userId)
        console.log("Related Users List is: ", relatedUsersList);
        
        let trainer = await new TrainerService().getTrainerOfClient(newSnitchData.userId)
        if(trainer != undefined){
            console.log("Trainer is: ", relatedUsersList);
            relatedUsersList.push(trainer)
        }
        
        // TODO - This is a string[] right now but we want to make a model. Check TODO on pushSnitchNotification
        let pushSnitchNotificationList: string[] = [];

        relatedUsersList.forEach(element => {
            pushSnitchNotificationList.push(element.userId)
        });

		const snitchOnUser = await new UserService().getUser(newSnitchData.userId);

        let response = await PushNotificationService.sendMessageToUsers(
			pushSnitchNotificationList,
			{
				notification: {
					title: `${snitchOnUser?.firstname} Needs Help!`,
					body: `Reach out to help them meet their goals.`,
				},
			},
			{ ...PresetOptions.HighPriority }
		);
        console.log("Response is ", response);
	}


    /**
     * Creates a new Snitch. Handles saving the snitches datetime
     * so that it can be mroe reliable than a users phone
     * @param data Just the data required to create a new Snitch
     */
    async createSnitch(data:CreateSnitchRequest): Promise<SnitchEvent> {
		console.log(data.userId)
        let snitch = new SnitchEvent(data.userId,new Date().toISOString(),data.originCoords,data.restaurantData)
        await DaoFactory.getSnitchDao().createSnitch(snitch);
        return snitch;
    }

    async updateSnitch(data: SnitchEvent) {
        await DaoFactory.getSnitchDao().updateSnitch(data);
    }

    async getSnitch(request:GetSnitchRequest): Promise<SnitchEvent|null> {
        return await DaoFactory.getSnitchDao().getSnitch(request);
    }

    async getUserSnitches(request:UserSnitchesRequest): Promise<UserSnitchesResponse> {
        return await DaoFactory.getSnitchDao().getSnitchesForUsers(request);
    }

    async switchSnitchToCheatmeal(data: SwitchSnitchToCheatmealRequest){
      await DaoFactory.getSnitchDao().switchSnitchToCheatmeal(data);
    }

    async deleteSnitch(data:SnitchEvent) {
        await DaoFactory.getSnitchDao().deleteSnitch(data);
    }
}