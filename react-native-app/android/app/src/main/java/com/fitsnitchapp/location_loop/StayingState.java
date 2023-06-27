package com.fitsnitchapp.location_loop;

import static com.fitsnitchapp.location_loop.LocationLoopManager.IVAL_WILL_STAY;
import static com.fitsnitchapp.location_loop.LocationLoopManager.checkForRestaurant;

import android.location.Location;
import android.util.Log;

import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.Restaurant;


/**
 * Allows users to stay in a restaurant without activating a snitch
 * after they have either been snitched on or used a cheat meal.
 */
public class StayingState extends LoopState {
    @Override
    public long getInitialLoopIval() {
        return IVAL_WILL_STAY;
    }

    public void handleNewLocation(Location location) {
        if (loopManager.didLocationChange(location)) {
            checkForRestaurant(LatLonPair.fromLocation(location), (Restaurant restaurant)->{
                if (restaurant == null || !restaurant.name.equals(loopManager.getActiveSnitch().restaurantData.name)) {
                    // User has left restaurant
                    Log.i("*****FIT", "User left restaurant - begin tracking again");
                    nextState(new BaseState());
                }
                else continueLoop(IVAL_WILL_STAY);
            });
        }
        else continueLoop(IVAL_WILL_STAY);
    }
}
