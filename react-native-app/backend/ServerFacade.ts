import axios from 'axios';
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

  static async createUser(user: User) {
    let res = await axios.post(this.apiBaseUrl+"/user_create", user);
    console.log("CREATE USER RESPONSE",res.data)
  }

  static async updateUser(user: User) {
    
  }

  //Probably have Request with name of user we want information on. Would we need different method for getting info on ourselves vs other users for their dashboards? 
  static async getUserProfile(){
      //useful code
      return 'User Profile!';
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
    const response = await axios.post("https://13js1r8gt8.execute-api.us-west-2.amazonaws.com/dev/check-location", payload);
    return response;
  }

  static async reportSnitch(){
    const response = await axios.post("https://13js1r8gt8.execute-api.us-west-2.amazonaws.com/dev/snitch-on-user");
  }
}
