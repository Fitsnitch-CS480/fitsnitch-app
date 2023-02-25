import SnitchDao from "./SnitchDao";
import TrainerRequestDao from "./TrainerRequestDao";
import TrainersDao from "./TrainersDao";
import UserDao from "./UserDao";
import CheatMealDao from "./CheatMealDao";
import PartnerAssociationDao from "./PartnerAssociationDao";
import PartnerAssociationRequestDao from "./PartnerAssociationRequestDao";

import DynamoSnitchDao from "./dynamo/DynamoSnitchDao";
import DynamoTrainerRequestDao from "./dynamo/DynamoTrainerRequestDao";
import DynamoTrainersDao from "./dynamo/DynamoTrainersDao";
import DynamoUserDao from "./dynamo/DynamoUserDao";
import DynamoPartnerAssociationDao from "./dynamo/DynamoPartnerAssociationDao";
import DynamoPartnerAssociationRequestDao from "./dynamo/DynamoPartnerAssociationRequestDao";
import DynamoCheatMealDao from "./dynamo/DynamoCheatMealDao";

export default class DaoFactory {
    public static getUserDao:()=>UserDao = () => new DynamoUserDao();
    public static getTrainersDao:()=>TrainersDao = () => new DynamoTrainersDao();
    public static getTrainerRequestDao:()=>TrainerRequestDao = () => new DynamoTrainerRequestDao();
    public static getPartnerAssociationDao:()=>PartnerAssociationDao = () => new DynamoPartnerAssociationDao();
    public static getPartnerAssociationRequestDao:()=>PartnerAssociationRequestDao = () => new DynamoPartnerAssociationRequestDao();
    public static getSnitchDao:()=>SnitchDao = () => new DynamoSnitchDao();
    public static getCheatMealDao:()=>CheatMealDao = () => new DynamoCheatMealDao();
}
