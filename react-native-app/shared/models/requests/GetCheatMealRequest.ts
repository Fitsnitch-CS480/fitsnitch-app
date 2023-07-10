 export class GetCheatMealRequest {
    constructor(
        /**
         * ID of the User
         */
        public userId:string,
        /**
         * Earliest time for which to get cheat meals
         */
        public periodStart:string) {
    }
}
