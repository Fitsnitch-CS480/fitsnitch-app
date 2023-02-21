import Login from "../../../../react-native-app/shared/models/Login";
import { UserSearchRequest, UserSearchResponse } from "../../../../react-native-app/shared/models/requests/UserSearchRequest";
import SignUp from "../../../../react-native-app/shared/models/SignUp";
import User from "../../../../react-native-app/shared/models/User";
import aws from 'aws-sdk';
import UserDao from "../UserDao";
import TableAccessObject, { Conditions, LogicalChainLink, LogicalConditionChain, LogicalOperator, PaginationOptions } from "./TableAccessObject";
import { isEmpty } from 'lodash';
import DB_TABLES from "./tables";

export default class DynamoUserDao implements UserDao {
    private schema = DB_TABLES.USERS;
    private userTable = new TableAccessObject<UserTableData>(this.schema);
    private userPoolId = process.env.COGNITO_USER_POOL_ID;
    private clientId = process.env.COGNITO_CLIENT_ID;

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
                    {
                      Name: 'firstname',
                      Value: data.firstname
                    },
                    {
                      Name: 'lastname',
                      Value: data.lastname
                    },
                    {
                      Name: 'phone',
                      Value: data.phone
                    },
                    {
                        Name: 'image',
                        Value: data.image
                      },
                  ],
                }).promise();
        
                let tokens = await cognito.adminInitiateAuth({
                AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
                ClientId: this.clientId,
                UserPoolId: this.userPoolId,
                AuthParameters: {
                    USERNAME: data.email,
                    PASSWORD: data.password,
                },
                }).promise();
        
                let user = await cognito.adminGetUser({
                UserPoolId: this.userPoolId,
                Username: data.email,
            }).promise();

            if(!isEmpty(user)){
                userId = user.Username;
                input = {
                    userId: user.Username,
                    email: user.UserAttributes.find((key:any) => key.Name === "email").Value,
                    firstname:user.UserAttributes.find((key:any) => key.Name === "firstname").Value,
                    lastname:user.UserAttributes.find((key:any) => key.Name === "lastname").Value,
                    image:user.UserAttributes.find((key:any) => key.Name === "image").Value,
                    phone:user.UserAttributes.find((key:any) => key.Name === "phone").Value,
                }
                await this.createUser(input);
            }
        } catch(err:any){
            throw new Error(err);
        }

        return await this.getUser(userId);
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