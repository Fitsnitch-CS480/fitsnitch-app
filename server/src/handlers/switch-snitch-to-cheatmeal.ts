import { APIGatewayProxyEventV2 } from 'aws-lambda';
import LambdaUtils from '../utils/LambdaUtils';
import CheatMealService from '../services/CheatMealService';
import SnitchService from '../services/SnitchService';
import SnitchEvent from '../../../react-native-app/shared/models/SnitchEvent';

export const handler = async (event: APIGatewayProxyEventV2) => {
  return await LambdaUtils.handleEventWithBody<SnitchEvent>(event, async (newCheatMealData, res)=>{
    try{
      await new SnitchService().switchSnitchToCheatmeal(newCheatMealData);
      res.setBodyToData("Successfully created Cheat Meal and deleted Snitch!");
      res.setCode(200);
    }
    catch (e) {
      console.log("Error creating Cheat Meal or deleting Snitch", e);
      res.setBodyToMessage("Could not create Cheat Meal or could not delete Snitch");
      res.setCode(500);
    }
    return res;
  });
}