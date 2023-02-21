import User from "../User";

export class UserLoginRequest {
    constructor(
        public username:string,
        public password:string
        ){}
}

export class UserLoginResponse {
    constructor(records: User[]) {
        records
    }
}