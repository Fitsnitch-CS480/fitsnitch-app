export default class User {
    constructor(
        public email: string,
        public firstname: string,
        public lastname: string,
        public password: string,
        public image?: string,
        public phone?: string,
    ) {}
}

