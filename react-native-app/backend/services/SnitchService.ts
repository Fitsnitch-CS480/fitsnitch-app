import { UserSnitchesRequest, UserSnitchesResponse } from "../../shared/models/requests/UserSnitchesRequest";
import User from "../../shared/models/User";
import ServerFacade from "../ServerFacade";

export default class SnitchService {
    public async getFeedUsers(userId:string): Promise<User[]> {
        let feedUsers: User[] = [];
        feedUsers.push(... await ServerFacade.getUserClients(userId))
        // TODO get Partners
        return feedUsers;
    }

    public async getUserSnitchFeedPage(feedIds:string[],lastPage?:UserSnitchesResponse): Promise<UserSnitchesResponse> {
        let page = await ServerFacade.getUserSnitchFeedPage(
            new UserSnitchesRequest(feedIds, lastPage?.pageSize, lastPage?.pageBreakKey)
        );
        
        return page
    }
    
}