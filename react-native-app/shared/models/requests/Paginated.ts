export class PaginatedRequest {
    constructor(
		public pageNumber:number,
        
        /** 
         * Defines the number of records to expect on each page. Some
         * request might allow this to be custom while others will
         * use their own set value. The response will always say what
         * pageSize value was used on the backend.
         */
        public pageSize:number,
	) {}

}

export class PaginatedResponse<T> {
    constructor(
        public records: T[],
        public pageNumber: number,
        public pageSize:number,
		public total: number
	) {

	}

}