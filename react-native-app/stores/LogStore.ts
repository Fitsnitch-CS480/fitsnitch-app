import { observable, action, computed, makeObservable } from "mobx";

const MAX_LOGS = 100;

export default class LogStore {
    constructor() {
	    makeObservable(this)
    }

    @observable logs:LogEntry[] = [];
    @observable recordLogs:boolean = true;
    @observable visible:boolean = false;
    
	_log(...items:any[]) {
        if (this.recordLogs) {
            // console.log(...items)
            this.logs.push(new LogEntry(...items))
            if (this.logs.length > MAX_LOGS) this.logs.shift()
        }
    }

    @action log(...items:any[]) {
		this._log(items);
	}

    @action setRecordLogs(val:boolean) {
        this.recordLogs = val;
    }

    @action clear() {
        this.logs = [];
    }

    @action setVisibility(value) {
        this.visible = value
    }

	@action handleNativeLog = (event) => {
		this._log(event.message, event.extras || '');
	}
}



export class LogEntry {
    public id: string;
    public created_at: string;
    public message: string;

    constructor (...items: any[]) {
        this.id = new Date().toISOString()+Math.ceil(Math.random()*100);
        this.created_at = new Date().toTimeString();
        this.message = "";
        for (let item of items) {
            let itemStr = ""

            // if (Array.isArray(item)) {
            //     itemStr = JSON.stringify(item, null, 2)
            // }
             if (typeof item === 'object') {
                 if (this.message) this.message += "\n"
                itemStr = JSON.stringify(item, null, 2)
            }
            else if (item.toString) {
                itemStr = item.toString()
            }
            else itemStr = item;
            
            this.message += itemStr +" ";
        }
    }


}