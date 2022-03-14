import { observable, action, makeObservable, runInAction, computed } from "mobx";
import ServerFacade from "../backend/ServerFacade";

export default abstract class CacheStore<T> {
    @observable hasFetched = false;
    @observable loading = false;
    @observable protected _data:T;

    constructor(defaultData:T) {
        this._data = defaultData;
	    makeObservable(this)
    }

    protected abstract getData(): Promise<T>;

    @computed get data(): T {
        if (!this.hasFetched) {
            this.fetch()
        }
        return this._data;
    }

    @action async fetch() {
        runInAction(()=>{
            this.hasFetched = true;
            this.loading = true;
        })
        let partners = await this.getData();
        // Needed to tell mobx that these are actions even
        // though they are async
        runInAction(() => {
            this._data = partners;
            this.loading = false;
        });
        console.log(this._data)
    }

}
