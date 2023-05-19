import SnitchEvent from "../../../react-native-app/shared/models/SnitchEvent";
import {UserSnitchesRequest, UserSnitchesResponse} from "../../../react-native-app/shared/models/requests/UserSnitchesRequest";
import {GetSnitchRequest} from "../../../react-native-app/shared/models/requests/GetSnitchRequest";

export default interface SnitchDao {
    createSnitch(data:SnitchEvent);
    updateSnitch(data: SnitchEvent);
    getSnitch(data:GetSnitchRequest): Promise<SnitchEvent|null>;
    getSnitchesForUsers(request:UserSnitchesRequest): Promise<UserSnitchesResponse>;
    deleteSnitch(data:SnitchEvent);
}