import AWS from 'aws-sdk';
import { SendMessagesResponse } from 'aws-sdk/clients/pinpoint';

// https://docs.aws.amazon.com/pinpoint/latest/developerguide/send-messages-push.html


// The AWS Region that you want to use to send the message. For a list of
// AWS Regions where the Amazon Pinpoint API is available, see
// https://docs.aws.amazon.com/pinpoint/latest/apireference/
const region = 'us-west-2';

// The Amazon Pinpoint project ID that you want to use when you send this 
// message. Make sure that the push channel is enabled for the project that 
// you choose.
const applicationId = 'fc0bfb43c77d4b53b6afc6f8a3c91699';

// An object that contains the unique token of the device that you want to send 
// the message to, and the push service that you want to use to send the message.
const recipient = {
    'token': 'F3E278BA-9EDA-449B-B5F6-3AC6440ACB6F',
    'service': 'APNS'
};

// The action that should occur when the recipient taps the message. Possible
// values are OPEN_APP (opens the app or brings it to the foreground),
// DEEP_LINK (opens the app to a specific page or interface), or URL (opens a
// specific URL in the device's web browser.)
const action = 'OPEN_APP';

// This value is only required if you use the URL action. This variable contains
// the URL that opens in the recipient's web browser.
const url = 'https://www.example.com';

// The priority of the push notification. If the value is 'normal', then the
// delivery of the message is optimized for battery usage on the recipient's
// device, and could be delayed. If the value is 'high', then the notification is
// sent immediately, and might wake a sleeping device.
const priority = 'high';

// The amount of time, in seconds, that the push notification service provider
// (such as FCM or APNS) should attempt to deliver the message before dropping
// it. Not all providers allow you specify a TTL value.
const ttl = 30;

// Boolean that specifies whether the notification is sent as a silent
// notification (a notification that doesn't display on the recipient's device).
const silent = false;

export class APNSService {

    static createMessageRequest(endpointId) {
        // The title that appears at the top of the push notification.
        const title = 'Your Friend Needs Help!';
        
        // The content of the push notification.
        const message = 'FitSnitch has detected this user making unhealthy choices';
        //var token = recipient['token'];
        let service = recipient['service'];
        let messageRequest;
        if (service == 'APNS') {
            messageRequest = {
                'Endpoints': {
                    [endpointId]: {
                    }
                },
                'MessageConfiguration': {
                    'APNSMessage': {
                    'Action': action,
                    'Body': message,
                    'Category': 'SNITCH', //allows iOS app to give option to call user being snitched on
                    'Priority': priority,
                    'SilentPush': silent,
                    'Title': title,
                    'TimeToLive': ttl,
                    'Url': url,
                    'Sound': 'default'
                    }
                }
                };
        }

        return messageRequest;
    }

    static showOutput(data){
        if (data["MessageResponse"]["Result"][recipient["token"]]["DeliveryStatus"]
            == "SUCCESSFUL") {
            var status = "Message sent! Response information: ";
        } else {
            var status = "The message wasn't sent. Response information: ";
        }
        console.log(status);
        console.dir(data, { depth: null });
    }

    static async sendMessageTo(endpointId){
        let token = recipient['token'];
        let service = recipient['service'];
        let messageRequest = this.createMessageRequest(endpointId);

        // Specify that you're using a shared credentials file, and specify the
        // IAM profile to use.
        //var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
        let credentials = new AWS.Credentials('AKIAVHRDVT3G6JKADGF3', 'MT8IoJGGslAx5OPD5FcjK6pptD+zet6/EoGPNGHz');
        AWS.config.credentials = credentials;

        // Specify the AWS Region to use.
        AWS.config.update({ region: region });

        //Create a new Pinpoint object.
        let pinpoint = new AWS.Pinpoint();
        let params = {
            "ApplicationId": applicationId,
            "MessageRequest": messageRequest
        };
        
        console.log("Sending Messages...");

        
        // Try to send the message.
        let result = await pinpoint.sendMessages(params).promise();
        console.log("Result is %s", result);
        console.log("MessageResponse is %s", result["MessageResponse"]);
        console.log("EndpointResult is %s", result["MessageResponse"]["EndpointResult"]);
        console.log("Token is %s", result["MessageResponse"]["EndpointResult"]?[recipient["token"]] : "Undefined value somehow");
        console.log("Testing if this works %s", result['MessageResponse']['Result']?[recipient["token"]]['StatusMessage']: "Undefined value somehow")
        // return result; https://awscli.amazonaws.com/v2/documentation/api/latest/reference/pinpoint/send-messages.html
        return result["MessageResponse"]["EndpointResult"]?[recipient["token"]]["DeliveryStatus"] : "Undefined value somehow";
    }

}