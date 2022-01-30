import axios from 'axios';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import { UserSearchRequest, UserSearchResponse } from '../shared/models/requests/UserSearchRequest';
import TrainerClientPair from '../shared/models/TrainerClientPair';
import User from '../shared/models/User'


/**
 * Acts as a Facade to the FitSnitch server. All network requests to the server should go through
 * this class.
 * All methods should be async. We should use REST (fetch data)
 */ 


function asRawString(data:string) {
  return `"${data}"`
}

 export default class ServerFacade {
  private static apiBaseUrl = "https://13js1r8gt8.execute-api.us-west-2.amazonaws.com/dev"

  static async getUserById(userId: string): Promise<User|null> {
    let res = await axios.post(this.apiBaseUrl+"/user_get", asRawString(userId))
      .catch(e=>console.log(e));
    if (!res) return null;
    console.log("GET USER RESPONSE",res.data)
    return res.data as User
  }

  static async userSearch(request:UserSearchRequest): Promise<UserSearchResponse> {
    let res = await axios.post(this.apiBaseUrl+"/user_search", request)
    console.log("USER SEARCH RESPONSE",res.data)
    return res.data
  }

  static async createUser(user: User) {
    let res = await axios.post(this.apiBaseUrl+"/user_create", user);
    console.log("CREATE USER RESPONSE",res.data)
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
        long: -111.6613
      } 
    }
    const response = await axios.post(this.apiBaseUrl+"/check-location", payload);
    return response;
  }

  static async reportSnitch(){
    const response = await axios.post(this.apiBaseUrl+"/snitch-on-user");
  }




  // TRAINER / CLIENT RELATIONSHIPS
  static async getTrainerStatus(trainer:User,user:User): Promise<RelationshipStatus> {
    let res = await axios.post(this.apiBaseUrl+"/trainer_get_status", new TrainerClientPair(trainer.userId,user.userId));
    console.log("TRAINER STATUS RESPONSE",res.data)
    return res.data;
  }


  static async requestTrainerForClient(trainer:User,client:User) {
    let res = await axios.post(this.apiBaseUrl+"/trainer_request_create", new TrainerClientPair(trainer.userId,client.userId));
    console.log("TRAINER REQUEST RESPONSE",res.status)
  }
  
  static async cancelTrainerRequest(trainer:User,client:User) {
    let res = await axios.post(this.apiBaseUrl+"/trainer_request_cancel", new TrainerClientPair(trainer.userId,client.userId));
    console.log("TRAINER REQUEST CANCEL RESPONSE",res.status)
  }
  
  static async approveClient(trainer:User,client:User) {
    let res = await axios.post(this.apiBaseUrl+"/trainer_request_approve", new TrainerClientPair(trainer.userId,client.userId));
    console.log("TRAINER APPROVE RESPONSE",res.status)
  }

  static async removeTrainerFromClient(trainer:User,client:User) {
    let res = await axios.post(this.apiBaseUrl+"/trainer_remove", new TrainerClientPair(trainer.userId,client.userId));
    console.log("TRAINER REMOVE RESPONSE",res.status)
  }

  static async getUserTrainer(userId:string): Promise<User|undefined> {
    let res = await axios.post(this.apiBaseUrl+"/trainer_get_for_client", asRawString(userId));
    console.log("CLIENT'S TRAINER",res.data)
    return res.data
  }
}
