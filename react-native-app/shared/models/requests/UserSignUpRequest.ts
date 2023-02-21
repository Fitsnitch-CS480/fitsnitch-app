import User from "../User";

export class UserSignUpRequest {
    constructor(
        public firstname:string,
        public lastname:string,
        public email:string,
        public password:string,
        public phone:string,
        ){}
}

export class UserSignUpResponse {
    constructor(records: User[]) {}
}