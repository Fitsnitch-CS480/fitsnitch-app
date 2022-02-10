import { UserSnitchesRequest, UserSnitchesResponse } from "../../shared/models/requests/UserSnitchesRequest";
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";
import Share from 'react-native-share';
import base64ImagesData from '../../utils/base64';
import SnitchEvent from "../../shared/models/SnitchEvent";
import UserDataService from "./UserDataService";
import { notifyMessage } from "../../utils/UiUtils";


export default class SnitchService {
    public async getFeedUsers(userId:string): Promise<User[]> {
        let feedUsers: User[] = [];
        feedUsers.push(... await ServerFacade.getUserClients(userId))
        // TODO get Partners
        return feedUsers;
    }

    public async getUserSnitchFeedPage(feedIds:string[],lastPage?:UserSnitchesResponse): Promise<UserSnitchesResponse> {
        return await ServerFacade.getUserSnitchFeedPage(
            new UserSnitchesRequest(feedIds, lastPage?.pageSize, lastPage?.pageBreakKey)
        );
    }

    public async shareSnitch(snitch:SnitchEvent, user?:User) {
        if (!user) {
            user = await new UserDataService().getUser(snitch.userId)
        }
        const shareOptions = {
            title: `Snitch Alert! ${user?.firstname} is cheating on their mealplan!`,
            message: `Snitch Alert! ${user?.firstname} is cheating on their mealplan!`,
            url: base64ImagesData.snitchAlert,
            failOnCancel: false,
        };
        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log('Share Response: ', ShareResponse);
            if (ShareResponse.success) notifyMessage("Successfully shared Snitch!")
        } catch (error) {
            console.log('Error =>', error);
            notifyMessage("Could not share snitch")
        }
    }

    
}