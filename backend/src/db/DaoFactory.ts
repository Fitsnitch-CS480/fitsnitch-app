import DynamoTrainerRequestDao from "./dynamo/DynamoTrainerRequestDao";
import DynamoTrainersDao from "./dynamo/DynamoTrainersDao";
import DynamoUserDao from "./dynamo/DynamoUserDao";
import TrainerRequestDao from "./TrainerRequestDao";
import TrainersDao from "./TrainersDAO";
import UserDao from "./UserDAO";
import DynamoPartnerAssociationDao from "./dynamo/DynamoPartnerAssociationDao";
import DynamoPartnerAssociationRequestDao from "./dynamo/DynamoPartnerAssociationRequestDao";
import PartnerAssociationDao from "./PartnerAssociationDAO";
import PartnerAssociationRequestDao from "./PartnerAssociationRequestDao";

export default class DaoFactory {
    public static getUserDao:()=>UserDao = () => new DynamoUserDao();
    public static getTrainersDao:()=>TrainersDao = () => new DynamoTrainersDao();
    public static getTrainerRequestDao:()=>TrainerRequestDao = () => new DynamoTrainerRequestDao();
    public static getPartnerAssociationDao:()=>PartnerAssociationDao = () => new DynamoPartnerAssociationDao();
    public static getPartnerAssociationRequestDao:()=>PartnerAssociationRequestDao = () => new DynamoPartnerAssociationRequestDao();
}