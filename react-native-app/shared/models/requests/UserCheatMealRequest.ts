import CheatMealEvent from "../CheatMealEvent";
import { PaginatedRequest, PaginatedResponse } from "./Paginated";


export class UserCheatMealRequest extends PaginatedRequest {
    constructor(
        public userId:string,
        public pageNumber:number,
        public pageSize:number,
    ) {
        super(pageNumber, pageSize);
    }
}

export class UserCheatMealResponse extends PaginatedResponse<CheatMealEvent> {
    constructor(records: CheatMealEvent[], pageNumber:number, pageSize:number, total:number) {
        super(records, pageNumber, pageSize, total);
    }
}