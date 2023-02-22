import Login from "../../../../react-native-app/shared/models/Login";
import { UserSearchRequest, UserSearchResponse } from "../../../../react-native-app/shared/models/requests/UserSearchRequest";
import SignUp from "../../../../react-native-app/shared/models/SignUp";
import User from "../../../../react-native-app/shared/models/User";
import Confirmation from "../../../../react-native-app/shared/models/Confirmation";
import aws from 'aws-sdk';
import UserDao from "../UserDao";
import TableAccessObject, { Conditions, LogicalChainLink, LogicalConditionChain, LogicalOperator, PaginationOptions } from "./TableAccessObject";
import { isEmpty } from 'lodash';
import DB_TABLES from "./tables";
import { CognitoUser } from "amazon-cognito-identity-js";

export default class DynamoUserDao implements UserDao {
    private schema = DB_TABLES.USERS;
    private userTable = new TableAccessObject<UserTableData>(this.schema);
    private userPoolId = process.env.COGNITO_USER_POOL_ID;
    private clientId = process.env.COGNITO_CLIENT_ID;
    private region = process.env.AWS_REGION;

    async login(data: Login): Promise<User|undefined> {
        let cognito:any = new aws.CognitoIdentityServiceProvider();
        let userId:string = '';

        try {
            let tokens = await cognito.adminInitiateAuth({
            AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
            ClientId: this.clientId,
            UserPoolId: this.userPoolId,
            AuthParameters: {
                USERNAME: data.username,
                PASSWORD: data.password,
            },
            }).promise();

            let user = await cognito.adminGetUser({
            UserPoolId: this.userPoolId,
            Username: data.username,
            }).promise();

            userId = user.Username;
        } catch(err:any){
            throw new Error(err);
        }

        return await this.getUser(userId);
    }
    
    async signUp(data: SignUp): Promise<any> {
        let cognito:any = new aws.CognitoIdentityServiceProvider();
        let userId:string = '';
        let input:User;
        try{
            await cognito.signUp({
                ClientId: this.clientId,
                Username: data.email,
                Password: data.password,
                UserAttributes: [
                    {
                      Name: 'email',
                      Value: data.email
                    },
                  ],
            }).promise();
        
            // let tokens = await cognito.adminInitiateAuth({
            //     AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
            //     ClientId: this.clientId,
            //     UserPoolId: this.userPoolId,
            //     AuthParameters: {
            //         USERNAME: data.email,
            //         PASSWORD: data.password,
            //     },
            // }).promise();
            // console.log("tokens: ", {tokens});
            let user = await cognito.adminGetUser({
                UserPoolId: this.userPoolId,
                Username: data.email,
            }).promise();
            console.log("user returned: ", {user});
            if(!isEmpty(user)){
                userId = user.Username;
                let responseUserId:string ='';
                let responseEmail:string ='';
    
                for(const item of user.UserAttributes){
                    console.log({item})
                    if(item.Name === 'sub'){
                        responseUserId = item.Value;
                    }
                    if(item.Name === 'email'){
                        responseEmail = item.Value;
                    }
                }
                input = {
                    userId: responseUserId,
                    email: responseEmail,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    image: data.image,
                    phone: data.phone,
                }
                await this.createUser(input);
            }
        } catch(err:any){
            throw new Error(err);
        }

        return await this.getUser(userId);
    }
    
    async sendConfirmation(data: Confirmation) {
        // await this.userTable.createOrUpdate(userToTableData(data));
        const {user, authCode} = data;
        console.log("user in confirmation: ", user);
        const cognito = new aws.CognitoIdentityServiceProvider({region: this.region});
        const params:any = {
            ClientId: this.clientId,
            Username: user.email,
            ConfirmationCode: authCode,
        };
        try{
            const result = await cognito.confirmSignUp(params).promise();
            console.log("confirm result: ", result)
        } catch(err:any){
            console.log("confirm err: ", err)
            throw new Error(err);
        }
        // let cognito:any = new aws.CognitoIdentityServiceProvider();

        return "Sign up succesful!";
    }

    async resendConfirmation() {
        // await this.userTable.createOrUpdate(userToTableData(data));
        return "hello";
    }

    async createUser(data: User) {
        await this.userTable.createOrUpdate(userToTableData(data));
    }

    async getUser(id: string): Promise<User|undefined> {
        if (!id) return undefined;
        let user = await this.userTable.getByPrimaryKey(id);
        // Convert UserTableData to Users
        return user ? tableDataToUser(user) : undefined;
    }

    async search(request:UserSearchRequest): Promise<UserSearchResponse> {
        let queryPieces = request.searchQuery.split(" ");
        let chain = queryPieces.reduce((chain:LogicalChainLink[], currentPiece, i)=>{
            chain.push(new Conditions.Contains("searchStrings",currentPiece.toLowerCase()))
            if (i < queryPieces.length-1) chain.push(LogicalOperator.AND)
            return chain;
        }, []);
        let pagination: PaginationOptions = {
            pageBreakKey: request.pageBreakKey,
            pageSize: request.pageSize
        }
        let page = await this.userTable.scan(new LogicalConditionChain(chain), pagination);
        // Convert UserTableData to Users
        page.records = page.records.map(u=>tableDataToUser(u) as UserTableData);
        return page;
    }

    async updateUser(data: User) {
        await this.userTable.createOrUpdate(userToTableData(data));
    }

    async deleteUser(id: string) {
        throw new Error("Method not implemented.");
    }
}


interface UserTableData extends User {
    searchStrings: string;
}

function userToTableData(user:User): UserTableData {
    return {
        ...user,
        searchStrings: `${user.firstname ?? ""}_${user.lastname ?? ""}`.toLowerCase()
    }
}

function tableDataToUser(data:UserTableData): User {
    return data as User;
}