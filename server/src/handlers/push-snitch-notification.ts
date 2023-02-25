import { APIGatewayProxyEventV2 } from "aws-lambda";
import { APNSService } from "../services/APNSService";
import SnitchService from "../services/SnitchService";
import LambaUtils from "../utils/LambdaUtils";


// let SnitchRecipient = require("./SnitchRecipient.js");
// let APNSService = require("./APNSService.js");
// let Snitch = require("./Snitch.js");


// Currently only pushing notifications through APNS
export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string[]>(event, async (pushSnitchNotificationList,res)=>{
        
        console.log("Entering handler...");
    
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
