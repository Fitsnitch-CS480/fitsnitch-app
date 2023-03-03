import CheatMealDao from "../CheatMealDao";
import TableAccessObject, { PaginationOptions, SortOp } from "./TableAccessObject";
import DB_TABLES from "./tables";
import CheatMealEvent from "../../../../react-native-app/shared/models/CheatMealEvent";
import { GetCheatMealRequest } from "../../../../react-native-app/shared/models/requests/GetCheatMealRequest";
import { UserCheatMealRequest, UserCheatMealResponse } from "../../../../react-native-app/shared/models/requests/UserCheatMealRequest";


export default class DynamoCheatMealDao implements CheatMealDao {
    private schema = DB_TABLES.CHEAT_MEALS;
    private table = new TableAccessObject<CheatMealEvent>(this.schema);

    async createCheatMeal(data: CheatMealEvent) {
        await this.table.createOrUpdate(data);
    }

    async getCheatMeal(request: GetCheatMealRequest): Promise<CheatMealEvent|null> {
        let matches = await this.table.query(request.userId, SortOp.EQUALS, request.created);
        if (matches.length >= 1) 
            return matches[0];
        else 
            return null;
    }

    async getCheatMeals(request: GetCheatMealRequest): Promise<CheatMealEvent[]|null> {
        let matches = await this.table.query(request.userId, SortOp.MORE_THAN_OR_EQUAL, request.created);
        if (matches.length >= 1) 
            return matches;
        else 
            return null;
    }

    async getUserCheatMeals(request: UserCheatMealRequest): Promise<UserCheatMealResponse> {
        let page = await this.table.pageQuery(request.userId, undefined, request as PaginationOptions, undefined, { ScanIndexForward: false });
        return new UserCheatMealResponse(page.records, page.pageBreakKey, page.pageSize);
    }

    async updateCheatMeal(data: CheatMealEvent) {
        await this.table.createOrUpdate(data);
    }

    async deleteCheatMeal(data: CheatMealEvent) {
        await this.table.deleteByKeys(data.userId, data.created);
    }
}
