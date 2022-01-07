export default class User {
    constructor(
        public userId: string,
        public firstname: string,
        public lastname: string,
        public phone: string|null,
    ) {}
}

