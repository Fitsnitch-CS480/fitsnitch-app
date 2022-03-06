import PartnerStatusResponse from './../shared/models/requests/PartnerStatusResponse';
import axios, { AxiosError, AxiosResponse } from 'axios';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import { UserSearchRequest, UserSearchResponse } from '../shared/models/requests/UserSearchRequest';
import { UserSnitchesRequest, UserSnitchesResponse } from '../shared/models/requests/UserSnitchesRequest';
import TrainerClientPair from '../shared/models/TrainerClientPair';
import PartnerAssociationPair from '../shared/models/PartnerAssociationPair';
import User from '../shared/models/User'
import PartnerRequest from '../shared/models/PartnerRequest';
import SnitchEvent from '../shared/models/SnitchEvent';
import { UserCheatMealRequest, UserCheatMealResponse } from '../shared/models/requests/UserCheatMealRequest';
import CheatMealEvent from '../shared/models/CheatMealEvent';
import { DrawerActions } from '@react-navigation/native';


/**
 * Acts as a Facade to the FitSnitch server. All network requests to the server should go through
 * this class.
 * All methods should be async. We should use REST (fetch data)
 */

const DEVMODE = false;

const apiBaseUrl = DEVMODE ? "http://10.0.2.2:3000"
  : "https://13js1r8gt8.execute-api.us-west-2.amazonaws.com/dev"

function asRawString(data:string) {
  return `"${data}"`
}

async function executeRequest<TResponse>(path:string, payload:any, print:boolean = false): Promise<ExecutionResult<TResponse>> {
  let tag = path+" "+Date.now();
  if (print) console.log(tag+": Executing Request\n", JSON.stringify(payload,null,2));
  try {
    let res = await axios.post(apiBaseUrl+path, payload);  
    if (print) console.log(tag+" Response\n", JSON.stringify(res.data,null,2))
    return new ExecutionSuccess<TResponse>(res);
  }
  catch (e:any) {
    console.log("HTTP ERROR --------------")
    console.log("Request:", tag)
    console.log("Payload:\n",  JSON.stringify(payload,null,2));
    console.log("Error:", e)
    console.log("-------------------------")
    return new ExecutionError<TResponse>(e);
  }
}

class ExecutionResult<T> {
  public data?:T;
  public status?: number;
  public errorCode?:string;
  public errorMessage?:string;
  public error?:Error;
  public response?: AxiosResponse<T>;
}

class ExecutionSuccess<T> extends ExecutionResult<T> {
  public data: T;
  public status: number;
  
  constructor (public res:AxiosResponse<T>) {
    super();
    this.data = res.data;
    this.response = res;
    this.status = res.status;
  }
}
class ExecutionError<T> extends ExecutionResult<T> {
  constructor (public error:AxiosError<T>) {
    super();
    this.errorCode = error.code;
    this.response = error.response;
    this.errorMessage = error.message;
  }
}

 export default class ServerFacade {

  static async getUserById(userId: string): Promise<User|undefined> {
    let res = await executeRequest<User|null>("/user_get", asRawString(userId))
    return res.data as User
  }

  static async userSearch(request:UserSearchRequest): Promise<UserSearchResponse> {
    let res = await executeRequest<UserSearchResponse>("/user_search", request)
    if (res.error || !res.data) {
      // give error feedback in UI
      return new UserSearchResponse([],undefined,undefined)
    }
    return res.data
  }

  static async createUser(user: User) {
    let res = await executeRequest("/user_create", user);
  }

  static async updateUser(user: User) {
    
  }



  static async checkLocation(){
    //request user location
    //specify endpoint
    const payload = {
      userId: 'dummy',
      location: {
        lat: 40.2508,
        lon: -111.6613
      } 
    }
    const response = await executeRequest("/check-location", payload);
    return response;
  }


  static async reportSnitch(){
    const response = await executeRequest("/snitch-on-user", null);
  }




  // TRAINER / CLIENT RELATIONSHIPS
  static async getTrainerStatus(trainer:User,user:User): Promise<RelationshipStatus> {
    let res = await executeRequest<RelationshipStatus>("/trainer_get_status", new TrainerClientPair(trainer.userId,user.userId));
    if (res.error || !res.data) {
      // give error feedback in UI
      return RelationshipStatus.NONEXISTENT
    }
    return res.data;
  }


  static async requestTrainerForClient(trainer:User,client:User) {
    let res = await executeRequest("/trainer_request_create", new TrainerClientPair(trainer.userId,client.userId));
  }
  
  static async cancelTrainerRequest(trainer:User,client:User) {
    let res = await executeRequest("/trainer_request_cancel", new TrainerClientPair(trainer.userId,client.userId));
  }
  
  static async approveClient(trainer:User,client:User) {
    let res = await executeRequest("/trainer_request_approve", new TrainerClientPair(trainer.userId,client.userId));
  }

  static async removeTrainerFromClient(trainer:User,client:User) {
    let res = await executeRequest("/trainer_remove", new TrainerClientPair(trainer.userId,client.userId));
  }

  static async getUserTrainer(userId:string): Promise<User|null> {
    let res = await executeRequest<User|null>("/trainer_get_for_client", asRawString(userId));
    if (res.error || !res.data) {
      // give error feedback in UI
      return null;
    }
    return res.data ?? null
  }

  static async getUserClients(userId:string): Promise<User[]> {
    let res = await executeRequest<User[]>("/trainer_get_clients", asRawString(userId));
    if (res.error || !res.data) {
      // give error feedback in UI
      return []
    }
    return res.data
  }

  
  static async getTrainerRequestsByTrainer(trainerId:string): Promise<User[]> {
    let res = await executeRequest<User[]>("/trainer_get_requests_for_trainer", asRawString(trainerId));
    if (res.error || !res.data) {
      // give error feedback in UI
      return []
    }
    return res.data
  }


  // SNITCHES
  static async getUserSnitchFeedPage(pageRequest: UserSnitchesRequest): Promise<UserSnitchesResponse> {
    let res = await executeRequest<UserSnitchesResponse>("/snitch-get-for-users", pageRequest);
    if (res.error || !res.data) {
      // give error feedback in UI
      return {
        records:[],
        pageBreakKey: pageRequest.pageBreakKey,
        pageSize: pageRequest.pageSize
      }
    }
    return res.data
  }

  static async createSnitch(snitch: SnitchEvent){
    let res = await executeRequest("/snitch-create", snitch);
  }

  // Cheat Meals
  static async getUserCheatMealFeedPage(pageRequest: UserCheatMealRequest): Promise<UserCheatMealResponse> {
    let res = await executeRequest<UserCheatMealResponse>("/cheatmeal-get-for-users", pageRequest);
    console.log("RES DATA: ", res.data);
    if (res.error || !res.data) {
      // give error feedback in UI
      return {
        records:[],
        pageBreakKey: pageRequest.pageBreakKey,
        pageSize: pageRequest.pageSize
      }
    }

    return res.data
  }

  static async createCheatMeal(meal: CheatMealEvent){
    let res = await executeRequest("/cheatmeal-create", meal);
  }


  // PARTNER / USER RELATIONSHIPS
  static async getPartnerStatus(partner:User,user:User): Promise<PartnerStatusResponse> {
    let res = await executeRequest<PartnerStatusResponse>("/partner-get-status", new PartnerAssociationPair(user.userId,partner.userId));
    if(res.data){
      return res.data;
    }
    return new PartnerStatusResponse(RelationshipStatus.NONEXISTENT)
  }


  static async getUserPartners(userId:string): Promise<User[]> {
    let res = await executeRequest<User[]>("/partner_get_for_user", asRawString(userId), true);
    if (res.error || !res.data) {
      // give error feedback in UI
      return []
    }
    return res.data
  }
  
  static async requestPartnerForUser(partner:User,user:User) {
    let res = await executeRequest("/partner-request-create", new PartnerRequest(partner.userId,user.userId));
  }

  static async getPartnerRequesters(userId:string): Promise<User[]> {
    let res = await executeRequest<User[]>("/partner_get_requesters", asRawString(userId), true);
    if (res.error || !res.data) {
      // give error feedback in UI
      return []
    }
    return res.data
}
  
  static async cancelPartnerRequest(requester:User,requestee:User) {
    let res = await executeRequest("/partner-request-cancel", new PartnerRequest(requester.userId,requestee.userId));
  }
  
  static async approvePartnerRequest(requester:User,requestee:User) {
    let res = await executeRequest("/partner-request-approve", new PartnerRequest(requester.userId,requestee.userId));
  }

  static async removePartnerFromUser(id1:User,id2:User) {
    let res = await executeRequest("/partner-remove", new PartnerAssociationPair(id1.userId,id2.userId));
  }

}
