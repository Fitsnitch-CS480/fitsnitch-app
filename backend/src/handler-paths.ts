import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ProxyResultWrapper } from "./utils/LambdaUtils";
import { handler as cheatmealCreate } from "./handlers/cheatmeal-create";
import { handler as cheatmealGetForUser } from "./handlers/cheatmeal-get-for-users";
import { handler as cheatmealGet } from "./handlers/cheatmeal-get";
import { handler as checkForRestaurant } from "./handlers/check-for-restaurant";
import { handler as partnerGetForUser } from "./handlers/partner-get-for-user";
import { handler as partnerGetRequesters } from "./handlers/partner-get-requesters";
import { handler as partnerGetStatus } from "./handlers/partner-get-status";
import { handler as partnerRemove } from "./handlers/partner-remove";
import { handler as partnerRequestApprove } from "./handlers/partner-request-approve";
import { handler as partnerRequestCancel } from "./handlers/partner-request-cancel";
import { handler as partnerRequestCreate } from "./handlers/partner-request-create";
import { handler as pushSnitchNotification } from "./handlers/push-snitch-notification";
import { handler as snitchCreate } from "./handlers/snitch-create";
import { handler as snitchOnUser } from "./handlers/snitch-on-user";
import { handler as snitchGetForUsers } from "./handlers/snitch-get-for-users";
import { handler as trainerGetClients } from "./handlers/trainer-get-clients";
import { handler as trainerGetForClient } from "./handlers/trainer-get-for-client";
import { handler as trainerGetRequestsForTrainer } from "./handlers/trainer-get-requests-for-trainer";
import { handler as trainerGetStatus } from "./handlers/trainer-get-status";
import { handler as trainerRemove } from "./handlers/trainer-remove";
import { handler as trainerRequestApprove } from "./handlers/trainer-request-approve";
import { handler as trainerRequestCancel } from "./handlers/trainer-request-cancel";
import { handler as trainerRequestCreate } from "./handlers/trainer-request-create";
import { handler as userCreate } from "./handlers/user-create";
import { handler as userGet } from "./handlers/user-get";
import { handler as userSearch } from "./handlers/user-search";
import { handler as userUpdate } from "./handlers/user-update";
import { handler as login } from "./handlers/login";
import { handler as signUp } from "./handlers/sign-up";
import { handler as confirmation } from "./handlers/confirmation";
import { handler as resendConfirmation } from "./handlers/resend-confirmation";

export const handlers: {[key:string]:(event:APIGatewayProxyEventV2)=>Promise<ProxyResultWrapper>} = {
    "/login": login,
    "/sign_up": signUp,
    "/confirmation": confirmation,
    "/resend_confirmation": resendConfirmation,
    "/user_get": userGet,
    "/user_search": userSearch,
    "/user_create": userCreate,
    "/user_update": userUpdate,
    "/check-location": checkForRestaurant,
    "/trainer_get_status": trainerGetStatus,
    "/trainer_request_create": trainerRequestCreate,
    "/trainer_request_cancel": trainerRequestCancel,
    "/trainer_request_approve": trainerRequestApprove,
    "/trainer_remove": trainerRemove,
    "/trainer_get_for_client": trainerGetForClient,
    "/trainer_get_clients": trainerGetClients,
    "/trainer_get_requests_for_trainer": trainerGetRequestsForTrainer,
    "/snitch-get-for-users": snitchGetForUsers,
    "/snitch_create": snitchCreate,
    "/snitch-on-user": snitchOnUser,
    "/partner-get-status": partnerGetStatus,
    "/partner_get_for_user": partnerGetForUser,
    "/partner-request-create": partnerRequestCreate,
    "/partner_get_requesters": partnerGetRequesters,
    "/partner-request-cancel": partnerRequestCancel,
    "/partner-request-approve": partnerRequestApprove,
    "/partner-remove": partnerRemove,
    "/push-snitch-notification" : pushSnitchNotification,
    "/cheatmeal-create" : cheatmealCreate,
    "/cheatmeal-get-for-users" : cheatmealGetForUser,
    "/cheatmeal-get" : cheatmealGet,
}