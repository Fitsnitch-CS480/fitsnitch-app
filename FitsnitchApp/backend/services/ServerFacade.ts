
/**
 * Acts as a Facade to the Tweeter server. All network requests to the server should go through
 * this class.
 * This class is a Singleton.
 * All methods should be async. We should use REST (fetch data)
 */ 
 export default class ServerFacade{

  /** */
  private instance: ServerFacade;
    
    constructor(){
      this.instance = this.getInstance();
        if (null == this.instance) {
            this.instance = new ServerFacade();               
            this.instance.constructor = null; // Note how the constructor is hidden to prevent instantiation
        }else{
          this.instance = new ServerFacade();  
        }
        return this.instance; //return the singleton instance
    }

    async getInstance(){
      return this.instance;
    }
    
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

    async getUserLocation(){
      return true;
    }


    

    
}


