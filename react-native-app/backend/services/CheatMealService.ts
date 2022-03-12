import CheatMealEvent from "../../shared/models/CheatMealEvent";
import { UserCheatMealRequest, UserCheatMealResponse } from "../../shared/models/requests/UserCheatMealRequest";
import ServerFacade from "../ServerFacade";

export default class CheatMealService {

    public async getUserChealMealFeedPage(feedId:string,lastPage?:UserCheatMealResponse): Promise<UserCheatMealResponse> {
        return await ServerFacade.getUserCheatMealFeedPage(
            new UserCheatMealRequest(feedId, lastPage?.pageSize, lastPage?.pageBreakKey)
        );
    }

    public async createNewCheatmeal(cheatmeal: CheatMealEvent){
      return await ServerFacade.createCheatMeal(cheatmeal);
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