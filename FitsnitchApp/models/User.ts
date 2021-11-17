export default class User {
    public id: string;
    public firstname: string;
    public lastname: string;
    public updates: String[];

    constructor(id:string,firstname:string,lastname:string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.updates = ["one", "two", "three"];
    }
}