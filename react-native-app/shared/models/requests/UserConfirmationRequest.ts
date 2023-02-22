import User from "../User";

export class UserConfirmationRequest {
    constructor(
        public user:User,
        public authCode:string
        ){}
}

export class UserConfirmationResponse {
    constructor(records: string) {
        records
    }
}