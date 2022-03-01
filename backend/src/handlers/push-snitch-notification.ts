import { APIGatewayProxyEventV2 } from "aws-lambda";
import { APNSService } from "../services/APNSService";
import LambaUtils from "../utils/LambdaUtils";


// let SnitchRecipient = require("./SnitchRecipient.js");
// let APNSService = require("./APNSService.js");
// let Snitch = require("./Snitch.js");


// Currently only pushing notifications through APNS
export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<string[]>(event, async (pushSnitchNotificationList,res)=>{
        
        console.log("Entering handler...");
    
        // TODO - make a res that makes sense. Clear both TODOS. 
        res.setBodyToData("Successfully pushed Snitch Notification!");
        res.setCode(200);

        // let mockRecipient = new SnitchRecipient("APNS","F3E278BA-9EDA-449B-B5F6-3AC6440ACB6F"); //hard coded endpoint id for now
        let mockRecipient = "F3E278BA-9EDA-449B-B5F6-3AC6440ACB6F";
    
    
        //do we want to support sms?
        // TODO - use pushSnitchNotificationList
        let recipients: string[] = [mockRecipient];
        
        console.log("Current user is: " + JSON.parse(JSON.stringify(event)).userId);
        
        let snitches = [];
        
        for (let i = 0; i < recipients.length; i++) {
            // TODO - We can just send a list to APNSService instead of each recipient individually. 
            let response = await APNSService.sendMessageTo(recipients[i]);
            
            console.log("Response is %s", response);
            // console.log("Response is %s", response?["MessageResponse"]["EndpointResult"][recipients[i]] : "Undefined value somehow");
            // console.log("recipeints[i] is %s", recipients[i]);
            
            // let responseAPNS = response?["MessageResponse"]["EndpointResult"][recipients[i]]["DeliveryStatus"] : "FAILED";
            
            

            if (response == "SUCCESSFUL") {
                console.log("Push Notification to " + recipients[i], true);
            } else {
                console.log("Push Notification FAILED to " + recipients[i], false);
                // TODO - make a res that makes sense. This is ghetto
                res.setBodyToMessage("Push Notification FAILED to " + recipients[i] + "and possibly others. Check console logs")
                res.setCode(500);
            }
            
            
        }

        return res;

    });
    
    
}
