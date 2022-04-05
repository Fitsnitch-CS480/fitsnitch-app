export default class User {
    constructor(
        public userId: string,
        public email: string,
        public firstname?: string,
        public lastname?: string,
        public image?: string,
        public phone?: string,
        public cheatmealSchedule?: string,
        public associatedDeviceTokens?: { [deviceType: number]: string[]}
    ) {}
}

export enum DeviceTokenType {
    APNS,
    Google
}

