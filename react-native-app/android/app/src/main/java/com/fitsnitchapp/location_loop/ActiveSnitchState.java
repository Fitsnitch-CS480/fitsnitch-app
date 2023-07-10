package com.fitsnitchapp.location_loop;

import android.location.Location;
import android.util.Log;


import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.Restaurant;

import static com.fitsnitchapp.LocationModule.JsLog;
import static com.fitsnitchapp.location_loop.LocationLoopManager.IVAL_WARNING;
import static com.fitsnitchapp.location_loop.LocationLoopManager.checkForRestaurant;

/**
 * Represents the time during which a snitch warning is active.
 */
public class ActiveSnitchState extends LoopState {
    @Override
    public long getInitialLoopIval() {
        /*
        Currently sets the next loop to occur after full warning ival, and then uses
        next location to determine whether or not to snitch.
         */
        return IVAL_WARNING;
    }

    public void handleNewLocation(Location location) {
        JsLog("Times up!");
        if (LocationLoopManager.getInstance().usedCheatForActiveSnitch()) {
            JsLog("User used cheat - not snitching");
            nextState(new StayingState());
        }
        else if (loopManager.didLocationChange(location)) {
            checkForRestaurant(LatLonPair.fromLocation(location), (Restaurant restaurant)->{
                if (restaurant == null || !restaurant.name.equals(loopManager.getActiveSnitch().restaurantData.name)) {
                    // User has left restaurant
                    JsLog("User left restaurant - not snitching");

                    /*
                       TODO handle cases where user left old restaurant but is found in new one
                       ie: first restaurant was false positive, user was walking by to REAL restaurant
                       Probably requires movement tracking during active snitch
                    */
                    nextState(new BaseState());
                }
                else doSnitch();
            });
        }
        else doSnitch();

        /* TODO Check for reasons to leave state, like leaving restaurant
           would require making the initial interval less than the warning ival
         */
    }

    private void doSnitch() {
        loopManager.publishActiveSnitch();
        nextState(new StayingState());
    }
}
