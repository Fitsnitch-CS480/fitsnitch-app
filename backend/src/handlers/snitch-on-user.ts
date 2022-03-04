import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CreateSnitchRequest } from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import { APNSService } from "../services/APNSService";
import PartnerAssociationService from "../services/PartnerAssociationService";
import SnitchService from "../services/SnitchService";
import TrainerService from "../services/TrainerService";
import LambaUtils from "../utils/LambdaUtils";


// Currently only pushing notifications through APNS
export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<CreateSnitchRequest>(event, async (newSnitchData,res)=>{
        
        console.log("Entering snitch-on-user handler...");

        try {
            await new SnitchService().createSnitch(newSnitchData)
            res.setBodyToData("Successfully created Snitch!");
            res.setCode(200);
        }
        catch (e) {
            console.log("Error creating Snitch:", e);
            res.setBodyToMessage("Could not create Snitch");
            res.setCode(500);
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


        // let mockRecipient = new SnitchRecipient("APNS","F3E278BA-9EDA-449B-B5F6-3AC6440ACB6F"); //hard coded endpoint id for now
        
        console.log("Current user is: " + JSON.parse(JSON.stringify(event)).userId);
        
        let response = await new SnitchService().pushSnitchNotification(pushSnitchNotificationList)
        console.log("Response is %s", response);

        if (response == "SUCCESSFUL") {
            console.log("Push Notification to " + pushSnitchNotificationList[0], true);
        } else {
            console.log("Push Notification FAILED to " + pushSnitchNotificationList[0], false);
            // TODO - make a res that makes sense. This is ghetto
            res.setBodyToMessage("Push Notification FAILED to " + pushSnitchNotificationList[0] + "and possibly others. Check console logs")
            res.setCode(500);
        }

        return res;

    });
    
    
}
