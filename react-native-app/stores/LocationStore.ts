import React from "react";
import { observable, action, computed, makeObservable } from "mobx";
import { LatLonPair } from "../shared/models/CoordinateModels";


const leavingGraceTime = 30000;
const snitchOrCheatRadius = 0.0001


export default class LocationStore {
    constructor() {
	    makeObservable(this)
    }

    /*
     * "Will leave" Grace Period
     */
    @observable committedToLeaveTime:number|null = null;

    @computed get gracePeriodStatus() {
        if (!this.committedToLeaveTime) return null;
        let timePassed = Date.now() - this.committedToLeaveTime
        if (timePassed > leavingGraceTime) {
            this.resetCommittedToLeave();
            return null;
        }
        return timePassed;
    }
    
    @action onCommittedToLeave() {
        this.committedToLeaveTime = Date.now()
    }

    @action resetCommittedToLeave() {
        this.committedToLeaveTime = null
    }



    /**
     * When snitching or cheating is triggered, wait
     * for them to leave restaurant before tracking again
     */
    @observable snitchOrCheatLocation:LatLonPair|null = null;
    
    @action onSnitchOrCheat(location) {
        this.snitchOrCheatLocation = location
    }

    @action checkSnitchOrCheatStatus(newLocation:LatLonPair): boolean {
        if (!this.snitchOrCheatLocation) return false;

        // BUG: does not account for coordinate wrapping. Will be
        // imprecise around the poles or the 180 lon line.
        let dist = Math.sqrt(
            (newLocation.lat - this.snitchOrCheatLocation.lat) ** 2
            + (newLocation.lon - this.snitchOrCheatLocation.lon) ** 2);
        
        if (dist > snitchOrCheatRadius) {
            this.snitchOrCheatLocation = null;
            return false;
        }

        return true;
    }
}
