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

export class UserSearchResponse extends PaginatedResponse<User> {
    constructor(records: User[], pageBreakKey?:string,pageSize?:number) {
        super(records,pageBreakKey,pageSize)
    }
}