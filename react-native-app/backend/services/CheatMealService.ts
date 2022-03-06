import { UserCheatMealRequest, UserCheatMealResponse } from "../../shared/models/requests/UserCheatMealRequest";
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";
import Share from 'react-native-share';
import base64ImagesData from '../../utils/base64';
import CheatMealEvent from "../../shared/models/CheatMealEvent";
import UserDataService from "./UserDataService";
import { notifyMessage } from "../../utils/UiUtils";

export default class CheatMealService {
    public async getFeedUsers(userId:string): Promise<User[]> {
        let user = await ServerFacade.getUserById(userId)
        if (!user) throw new Error("Could not get user: "+userId)
        let clients = await ServerFacade.getUserClients(userId)
        let partners = await ServerFacade.getUserPartners(userId)
        return Array.from(new Set([user, ...clients, ...partners]));
    }

    public async getUserChealMealFeedPage(feedId:string,lastPage?:UserCheatMealResponse): Promise<UserCheatMealResponse> {
        return await ServerFacade.getUserCheatMealFeedPage(
            new UserCheatMealRequest(feedId, lastPage?.pageSize, lastPage?.pageBreakKey)
        );
    }

    // public async shareMeal(meal:CheatMealEvent, user?:User) {
    //     if (!user) {
    //         user = await new UserDataService().getUser(meal.userId)
    //     }
    //     const shareOptions = {
    //         title: `Cheat Meal Alert! ${user?.firstname} is using a cheat meal!`,
    //         message: `Cheat Meal Alert! ${user?.firstname} is using a cheat meal!`,
    //         url: base64ImagesData.cheatMealAlert,
    //         failOnCancel: false,
    //     };
    //     try {
    //         const ShareResponse = await Share.open(shareOptions);
    //         console.log('Share Response: ', ShareResponse);
    //         if (ShareResponse.success) notifyMessage("Successfully shared Cheat Meal!")
    //     } catch (error) {
    //         console.log('Error =>', error);
    //         notifyMessage("Could not share cheat meal")
    //     }
    // }
    
}