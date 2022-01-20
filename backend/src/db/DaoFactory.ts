import DynamoTrainersDao from "./dynamo/DynamoTrainersDoa";
import DynamoUserDao from "./dynamo/DynamoUserDoa";
import TrainersDao from "./TrainersDao";
import UserDao from "./UserDao";

export default class DaoFactory {
    public static getUserDao:()=>UserDao = () => new DynamoUserDao();
    public static getTrainersDao:()=>TrainersDao = () => new DynamoTrainersDao();
}