import CheatMealEvent from "../CheatMealEvent";
import { PaginatedRequest, PaginatedResponse } from "./Paginated";


export class UserCheatMealRequest extends PaginatedRequest {
    constructor(
        public userId:string,
        pageSize?:number,
        pageBreakKey?:string,
    ) {
        super(pageBreakKey, pageSize);
    }
}

export class UserCheatMealResponse extends PaginatedResponse<CheatMealEvent> {
    constructor(records: CheatMealEvent[], pageBreakKey?:string, pageSize?:number) {
        super(records, pageBreakKey, pageSize);
    }
}