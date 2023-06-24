package com.fitsnitchapp.location_loop;

import android.location.Location;

public abstract class LoopState {
    protected final LocationLoopManager loopManager = LocationLoopManager.getInstance();

    /**
     * Performs the logic for a particular loop in the current state
     * @param location
     */
    public abstract void handleNewLocation(Location location);

    /**
     * Provides the initial loop interval when state begins.
     * Other factors may determine whether or not this is even called.
     * If not overridden or if 0 is returned, the service may choose an arbitrary interval.
     * @return The amount of time to wait for the next loop
     */
    public long getInitialLoopIval() {
        return 0;
    };

    protected void continueLoop(long waitTime) {
        LocationLoopManager.getInstance().setNextAlarm(waitTime);
    }

    public void nextState(LoopState newState) {
        LocationLoopManager.getInstance().enterLoopState(newState);
    }
}
