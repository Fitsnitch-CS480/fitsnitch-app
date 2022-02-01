/**
 * Defines the two properies necessary to retrieve a single SnitchEvent
 */
export class GetSnitchRequest {
    constructor(
        /**
         * ID of the User
         */
        public userId:string,
        /**
         * Datetie of the snitch, used as a unique identifier
         */
        public datetime:string) {
    }
}
