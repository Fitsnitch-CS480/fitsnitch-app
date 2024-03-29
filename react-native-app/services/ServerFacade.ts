import PartnerStatusResponse from './../shared/models/requests/PartnerStatusResponse';
import axios, { AxiosError, AxiosResponse } from 'axios';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import { UserSnitchesRequest, UserSnitchesResponse } from '../shared/models/requests/UserSnitchesRequest';
import TrainerClientPair from '../shared/models/TrainerClientPair';
import PartnerAssociationPair from '../shared/models/PartnerAssociationPair';
import User from '../shared/models/User'
import PartnerRequest from '../shared/models/PartnerRequest';
import SnitchEvent from '../shared/models/SnitchEvent';
import { UserCheatMealRequest, UserCheatMealResponse } from '../shared/models/requests/UserCheatMealRequest';
import CheatMealEvent from '../shared/models/CheatMealEvent';
import { CreateSnitchRequest } from '../shared/models/requests/CreateSnitchRequest';
import { LatLonPair } from '../shared/models/CoordinateModels';
import { GetCheatMealRequest } from '../shared/models/requests/GetCheatMealRequest';
import Config from "react-native-config";

/**
 * Acts as a Facade to the FitSnitch server. All network requests to the server should go through
 * this class.
 * All methods should be async. We should use REST (fetch data)
 */


/**
 * Env vars provided via `react-native-config`.
 * https://medium.com/armenotech/configure-environment-variables-with-react-native-config-for-ios-and-android-7079c0842d8b
 * https://www.npmjs.com/package/react-native-config
 */
const apiBaseUrl = Config.API_URL;

console.log("USING URL:",apiBaseUrl)

function asRawString(data:string) {
  return `"${data}"`
}

export const request = axios.create({
	baseURL: apiBaseUrl,
});

async function executeRequest<TResponse>(path:string, payload:any, print:boolean = false): Promise<ExecutionResult<TResponse>> {
  let tag = apiBaseUrl+'/lambda'+path+" "+Date.now();
  if (print) console.log(tag+": Executing Request\n", JSON.stringify(payload,null,2));
  try {
    let res = await axios.post(apiBaseUrl+'/lambda'+path, payload);  
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

  static async createUser(user: User) {
    let res = await executeRequest("/user_create", user);
  }

  static async updateUser(user: User) {
    return await executeRequest("/user_update", user);
  }

  static async checkLocation(lat : number, lon : number){
    //request user location
    //specify endpoint
    const payload = {
      userId: 'dummy',
      location: new LatLonPair(lat, lon)
    }
    const response = await executeRequest("/check-location", payload);
    return response;
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
        pageNumber: pageRequest.pageNumber,
        total: 0,
        pageSize: pageRequest.pageSize
      }
    }
    return res.data
  }

  // static async createSnitch(snitch: SnitchEvent){
  //   let res = await executeRequest("/snitch-create", snitch);
  // }

  static async switchToCheatmeal(data: SnitchEvent){
    let res = await executeRequest("/switch-snitch-to-cheatmeal", data);
  }

  // Cheat Meals
  static async getUserCheatMealFeedPage(pageRequest: UserCheatMealRequest): Promise<UserCheatMealResponse> {
	console.log(pageRequest)
    let res = await executeRequest<UserCheatMealResponse>("/cheatmeal-get-for-users", pageRequest);
    if (res.error || !res.data) {
      // give error feedback in UI
      return {
        records:[],
        pageNumber: pageRequest.pageNumber,
        total: 0,
        pageSize: pageRequest.pageSize
      }
    }
    return res.data
  }

  static async createCheatMeal(cheatmeal: CheatMealEvent){
    let res = await executeRequest("/cheatmeal-create", cheatmeal);
  }

  static async getCheatMeals(user:User){
    let interval;
    if (user.cheatmealSchedule) {
      interval = user.cheatmealSchedule.split("_")[0];
    } else {
      return null;
    }

    let intervalDateTime = new Date();
    if (interval == "month") {
      intervalDateTime.setMonth(intervalDateTime.getMonth() - 1);
    } else {
      intervalDateTime.setDate(intervalDateTime.getDate() - 7);
    }
    let request = new GetCheatMealRequest(user.userId, intervalDateTime.toISOString());
    
    let res = await executeRequest<CheatMealEvent[]>("/cheatmeal-get", request);
    if (res.error || !res.data) {
      // give error feedback in UI
      return null;
    }
    return res.data;
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
    let res = await executeRequest<User[]>("/partner_get_for_user", asRawString(userId));
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
    let res = await executeRequest<User[]>("/partner_get_requesters", asRawString(userId));
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
