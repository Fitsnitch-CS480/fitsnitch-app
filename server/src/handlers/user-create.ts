import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import UserService from "../services/UserService";
import { User } from "@prisma/client";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<User>(event, async (newUserData,res)=>{
        try {
            await new UserService().createUser(newUserData)
            res.setBodyToMessage("Successfully created user!");
            res.setCode(200);
        }
        catch (e) {
            console.log("Error creating user:", e);
            res.setBodyToMessage("Could not create user");
            res.setCode(500);
        }
        return res;
    });
}