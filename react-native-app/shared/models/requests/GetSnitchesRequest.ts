import SnitchEvent from "../SnitchEvent";
import { PaginatedRequest, PaginatedResponse } from "./Paginated";

export type GetSnitchesRequestProps = {
    userIds:string[]
    pageBreakKey?:string
    maxPageSize?:number
    /**
     * ISO FORMAT
     */
    startDate?:string
    /**
     * ISO FORMAT
     */
    endDate?:string
}
export class GetSnitchesRequest {
    userIds:string[]
    pageBreakKey?:string
    maxPageSize?:number
    /**
     * ISO FORMAT
     */
    startDate?:string
    /**
     * ISO FORMAT
     */
    endDate?:string

    constructor(props:GetSnitchesRequestProps) {
        this.userIds = props.userIds
        this.pageBreakKey = props.pageBreakKey
        this.maxPageSize = props.maxPageSize
        this.startDate = props.startDate
        this.endDate = props.endDate
    }
}

export class GetSnitchesResponse extends PaginatedResponse<SnitchEvent> {
    constructor(records: SnitchEvent[], pageBreakKey?:string, pageSize?:number) {
        super(records,pageBreakKey,pageSize)
    }
}