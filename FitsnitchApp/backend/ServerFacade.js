
/**
 * Acts as a Facade to the Tweeter server. All network requests to the server should go through
 * this class.
 * This class is a Singleton.
 * All methods should be async. We should use REST (fetch data)
 */ 
class ServerFacade{
    
    constructor(){
        if (null == instance) {
            instance = new ServerFacade();               
            instance.constructor = null; // Note how the constructor is hidden to prevent instantiation
        }
        return instance; //return the singleton instance
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


    


    

    
}


