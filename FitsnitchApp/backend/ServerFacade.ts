import axios from 'axios';
/**
 * Acts as a Facade to the Tweeter server. All network requests to the server should go through
 * this class.
 * This class is a Singleton.
 * All methods should be async. We should use REST (fetch data)
 */ 
 export default class ServerFacade{
    
    //Probably out of first interactions of the app
    async getStatsDashboard(){
        //useful code
        return 'Stats Dashboard!';
    }


    async getSnitchesDashboard(){
        //useful code
        return 'Snitches Dashboard!';
    }

    async getPeopleDashboard(){
        //useful code
        return 'People Dashboard!';
    }

    //Probably have Request with name of user we want information on. Would we need different method for getting info on ourselves vs other users for their dashboards? 
    async getUserProfile(){
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
    }
}
