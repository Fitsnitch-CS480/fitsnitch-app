import { SwitchSnitchToCheatmealRequest } from '../../../../react-native-app/shared/models/requests/SwitchSnitchToCheatmealRequest';
import { GetSnitchRequest } from "../../../../react-native-app/shared/models/requests/GetSnitchRequest";
import { UserSnitchesRequest, UserSnitchesResponse } from "../../../../react-native-app/shared/models/requests/UserSnitchesRequest";
import SnitchEvent from "../../../../react-native-app/shared/models/SnitchEvent";
import SnitchDao from "../SnitchDao";
import PriorityQueue from "./PriorityQueue";
import TableAccessObject, { Conditions, PaginationOptions, SortOp } from "./TableAccessObject";
import DB_TABLES from "./tables";
import DynamoCheatMealDao from './DynamoCheatMealDao';

export default class DynamoSnitchDao implements SnitchDao {
    private schema = DB_TABLES.SNITCHES;
    private table = new TableAccessObject<SnitchEvent>(this.schema);

    async createSnitch(data: SnitchEvent) {
        await this.table.createOrUpdate(data);
    }

    async getSnitch(request: GetSnitchRequest): Promise<SnitchEvent|null> {
        let matches = await this.table.query(request.userId, SortOp.EQUALS, request.created);
        if (matches.length >= 1) return matches[0]
        else return null;
    }

    async switchSnitchToCheatmeal(data: SwitchSnitchToCheatmealRequest){
      await new DynamoCheatMealDao().createCheatMeal(data);
      await this.table.deleteByKeys(data.userId,data.created);
    }

    async getSnitchesForUsers(request: UserSnitchesRequest): Promise<UserSnitchesResponse> {
        if (request.userIds.length === 1) return this.getUserSnitches(request.userIds[0],request as PaginationOptions)

        // GOAL: Find all snitches for all users in date range, but limit results to pageSize!
        // To minimize the number of unnecessary and duplicate reads, get the next Snitches
        // for each user, BUT only one at a time, keeping track of which is most recent. After
        // we identify the most recent for all users, add just that one to the page, fetch another
        // for that user, and check for the next most recent again. By the end we will have only
        // read n more records than the page size.

        let records:SnitchEvent[] = [];

        // Maintain a priority queue for quick automatic sorting. Sort by date string plus userId
        // to avoid duplicate timestamps.

        let recencyQueue = new SnitchQueue();
        let usersWithMoreSnitches = new Set(request.userIds);

        // Load inital data. We have to have at least one snitch for all users so we know which
        // is the most recent for sure.
        
        let ctx = this;
        /**
         * 
         * Adds the most recent snitch per user to the queue. If the user has no more snitches in the date range,
         * removes them from the userId list so we stop asking for more.
         * 
         * @param userId 
         * @param latestDate The date before which to look for snitches
         * @param includeEqual Indicates that the condition should use "<=" rather than "<"
         */
        async function loadNextForUser(userId:string, latestDate?:string, includeEqual:boolean=false) {
            if (!usersWithMoreSnitches.has(userId)) return;
            let Comparison = includeEqual? Conditions.LessOrEqual : Conditions.LessThan;
            let dateCondition = new Comparison(DB_TABLES.SNITCHES.sortKey,latestDate || new Date().toISOString())
            let matches = await ctx.table.pageQuery(userId,dateCondition,{pageSize:1},undefined,{ScanIndexForward: false})
            let nextSnitch = matches.records[0];
            if (!nextSnitch) usersWithMoreSnitches.delete(userId);
            else recencyQueue.insert(nextSnitch);
        }

        let pageBreakCreated:any = undefined;
        let pageBreakUserId:any = undefined;

        // This method returns a pageBreakKey as a json string of the last SnitchEvent of the previous page.
        // If the client wants the next page it will send back that pageBreakKey, otherwise we will start
        // from the top again
        if (request.pageBreakKey) {
            let pageBreakKey = JSON.parse(request.pageBreakKey) as SnitchEvent;
            pageBreakCreated = pageBreakKey.created;
            pageBreakUserId = pageBreakKey.userId;
        }

        await Promise.all(Array.from(usersWithMoreSnitches).map(async id=>{
            
            // Handle the edge case that the previous page ended between two snictches
            // that have the same created time and different userIds. In that case,
            // the pageBreakKey would have a userId "greater than" any of the same
            // created time that didn't make it on the page, so for any userId "less"
            // than that, we need to check for equal timestamps rather than just lesser
            // ones.
            await loadNextForUser(id,pageBreakCreated,id < pageBreakUserId)
        }))


        // Repeat this process until the page is full OR there are no more records to fetch
        while ((request.pageSize && records.length < request.pageSize && usersWithMoreSnitches.size > 0) || (!request.pageSize && usersWithMoreSnitches.size > 0)) {
            let nextSnitch = recencyQueue.popMin();

            if (!nextSnitch) throw new Error("Queue should not be empty of snitches!")
            records.push(nextSnitch);
            await loadNextForUser(nextSnitch.userId, nextSnitch.created);
        }

        // In order to pick up the list exactly where we left off, we must return results ordered
        // first by datetime and second by userId, AS WELL AS the compound key of the last snitch
        // that fit on the page, if there are more to retrieve.

        let pageBreakKey:any = undefined;
        if (records.length > 0 && usersWithMoreSnitches.size > 0) {
            pageBreakKey = JSON.stringify(records[records.length-1]);
        }
        return new UserSnitchesResponse(records, pageBreakKey, request.pageSize)
    }

    async getUserSnitches(userId: string, pagination: PaginationOptions): Promise<UserSnitchesResponse> {
        let page = await this.table.pageQuery(userId,undefined,pagination,undefined,{ScanIndexForward: false});
        return new UserSnitchesResponse(page.records, page.pageBreakKey, page.pageSize)
    }

    async updateSnitch(data: SnitchEvent) {
        await this.table.createOrUpdate(data);
    }

    async deleteSnitch(data: SnitchEvent) {
        await this.table.deleteByKeys(data.userId,data.created);
    }
}


class SnitchQueue extends PriorityQueue<SnitchEvent> {
    protected isHigherPriority(a: SnitchEvent, b: SnitchEvent): boolean {
        // Datetime must be ISO format, then the "greater" value will be
        // the most recent
        return `${a.created}_${a.userId}` > `${b.created}_${b.userId}`;
    }
}