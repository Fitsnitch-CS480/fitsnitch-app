package com.fitsnitchapp.location_loop;

import android.location.Location;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.Restaurant;
import com.fitsnitchapp.SnitchTrigger;

import static com.fitsnitchapp.location_loop.LocationLoopService.IVAL_LOOP_SHORT;
import static com.fitsnitchapp.location_loop.LocationLoopService.IVAL_WARNING;
import static com.fitsnitchapp.location_loop.LocationLoopService.checkForRestaurant;
import static com.fitsnitchapp.location_loop.LocationLoopService.didLocationChange;
import static com.fitsnitchapp.location_loop.LocationLoopService.getActiveSnitch;
import static com.fitsnitchapp.location_loop.LocationLoopService.publishActiveSnitch;
import static com.fitsnitchapp.location_loop.LocationLoopService.usedCheatForActiveSnitch;

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
        Log.i("***FIT", "Times up!");
        if (usedCheatForActiveSnitch()) {
            Log.i("*****FIT", "User used cheat - not snitching");
            nextState(new StayingState());
        }
        else if (didLocationChange(location)) {
            checkForRestaurant(LatLonPair.fromLocation(location), (Restaurant restaurant)->{
                if (restaurant == null || !restaurant.name.equals(getActiveSnitch().restaurantData.name)) {
                    // User has left restaurant
                    Log.i("*****FIT", "User left restaurant - not snitching");

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
        publishActiveSnitch();
        nextState(new StayingState());
    }
}
