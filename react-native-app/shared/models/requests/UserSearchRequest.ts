import User from "../User";
import { PaginatedRequest, PaginatedResponse } from "./Paginated";

export class UserSearchRequest extends PaginatedRequest {
    constructor(
        public searchQuery:string,
        public pageNumber?:number,
        public pageSize?:number
	) {
		super(pageNumber,pageSize)
	}
}

export class UserSearchResponse extends PaginatedResponse<User> {
    constructor(records: User[], pageBreakKey?:string,pageSize?:number) {
        super(records,pageBreakKey,pageSize)
    }
}