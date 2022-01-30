export default class User {
    constructor(
        public userId: string,
        public email: string,
        public firstname?: string,
        public lastname?: string,
        public image?: string,
        public phone?: string,
    ) {}
}

