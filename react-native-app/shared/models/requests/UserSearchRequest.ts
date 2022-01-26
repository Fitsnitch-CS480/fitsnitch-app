import User from "../User";
import { PaginatedRequest, PaginatedResponse } from "./Paginated";

export class UserSearchRequest extends PaginatedRequest {
    constructor(
        public searchQuery:string,
        public pageBreakKey?:string,
        public pageSize?:number){
            super(pageBreakKey,pageSize)
        }
}

export type UserSearchResponse = PaginatedResponse<User>;