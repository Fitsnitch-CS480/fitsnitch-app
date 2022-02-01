import SnitchEvent from "../../../react-native-app/shared/models/SnitchEvent";
import {UserSnitchesRequest, UserSnitchesResponse} from "../../../react-native-app/shared/models/requests/GetSnitchesRequest";
import {GetSnitchRequest} from "../../../react-native-app/shared/models/requests/GetSnitchRequest";
import {CreateSnitchRequest} from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";

export default interface SnitchesDao {
    createSnitch(data:CreateSnitchRequest): Promise<SnitchEvent>;
    updateSnitch(data: SnitchEvent);
    getSnitch(data:GetSnitchRequest): Promise<SnitchEvent|undefined>;
    getSnitchesForUsers(request:UserSnitchesRequest): Promise<UserSnitchesResponse>;
    deleteSnitch(data:SnitchEvent);
}