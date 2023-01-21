package com.fitsnitchapp.location_loop;

import android.location.Location;
import android.util.Log;

import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.Restaurant;

import static com.fitsnitchapp.location_loop.LocationLoopService.IVAL_WARNING;
import static com.fitsnitchapp.location_loop.LocationLoopService.IVAL_WILL_STAY;
import static com.fitsnitchapp.location_loop.LocationLoopService.checkForRestaurant;
import static com.fitsnitchapp.location_loop.LocationLoopService.didLocationChange;
import static com.fitsnitchapp.location_loop.LocationLoopService.getActiveSnitch;
import static com.fitsnitchapp.location_loop.LocationLoopService.usedCheatForActiveSnitch;

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
        if (didLocationChange(location)) {
            checkForRestaurant(LatLonPair.fromLocation(location), (Restaurant restaurant)->{
                if (restaurant == null || !restaurant.name.equals(getActiveSnitch().restaurantData.name)) {
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
