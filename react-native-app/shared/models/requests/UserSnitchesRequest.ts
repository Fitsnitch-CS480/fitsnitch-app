import SnitchEvent from "../SnitchEvent";
import { PaginatedRequest, PaginatedResponse } from "./Paginated";


export class UserSnitchesRequest extends PaginatedRequest {
    constructor(
        public userIds:string[],
        pageSize?:number,
        pageBreakKey?:string,
    ) {
        super(pageBreakKey,pageSize)
    }
}

export class UserSnitchesResponse extends PaginatedResponse<SnitchEvent> {
    constructor(records: SnitchEvent[], pageBreakKey?:string, pageSize?:number) {
        super(records,pageBreakKey,pageSize)
    }
}