/**
 * Defines the two properies necessary to retrieve a single CheatMeal
 */
 export class GetCheatMealRequest {
    constructor(
        /**
         * ID of the User
         */
        public userId:string,
        /**
         * Datetime of the CheatMeal, used as a unique identifier
         */
        public created:string) {
    }
}
