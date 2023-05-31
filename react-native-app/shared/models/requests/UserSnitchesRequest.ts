import SnitchEvent from "../SnitchEvent";
import { PaginatedRequest, PaginatedResponse } from "./Paginated";


export class UserSnitchesRequest extends PaginatedRequest {
    constructor(
        public userIds:string[],
        public pageSize:number,
        public pageNumber:number,
    ) {
        super(pageNumber, pageSize)
    }
}

export class UserSnitchesResponse extends PaginatedResponse<SnitchEvent> {
    constructor(public records: SnitchEvent[], public pageSize:number, public pageNumber:number, public total:number) {
        super(records, pageSize, pageNumber, total)
    }
}