import User from "./User";

export default class Confirmation {
    constructor(
        public user: User,
        public authCode: string,
    ) {}
}