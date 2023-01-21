export class PaginatedRequest {
    constructor(
        /** When requesting a subsequent page, this will mark the last item
         *  on the previous page. It will match exactly the same property
         *  on the response object.
         * 
         *  If not specified the API will return the first page.
         */
        public pageBreakKey?:string,
        
        /** 
         * Defines the number of records to expect on each page. Some
         * request might allow this to be custom while others will
         * use their own set value. The response will always say what
         * pageSize value was used on the backend.
         */
        public pageSize?:number){}
}

export class PaginatedResponse<T> {
    constructor(
        /**
         * The records of the current page.
         */
        public records: T[],

        /** 
         * Indicates that there are more pages to retrieve,
         * and marks where the last page left off.
         * 
         * This same value must be provided in the next request
         * to get the correct next page!
         * 
         * If null, there are no more pages to retrieve.
         */
        public pageBreakKey?:string,
        
        /** 
         * The pageSize used by the backend when processing
         * the query. This does not necessarily match the
         * pageSize requested on the request object.
         */
        public pageSize?:number){}
}