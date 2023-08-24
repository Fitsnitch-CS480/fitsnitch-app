import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";
import { User } from "@prisma/client";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<User>(event, async (newUserData,res)=>{
        try {
            await UserService.updateUser(newUserData)
            res.setBodyToMessage("Successfully updated user!");
            res.setCode(200);
        }
        catch (e) {
            console.log("Error updating user:", e);
            res.setBodyToMessage("Could not update user");
            res.setCode(500);
        }
        return res;
    });
}