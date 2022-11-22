package com.fitsnitchapp.location_loop;

import android.location.Location;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.SnitchTrigger;

import static com.fitsnitchapp.location_loop.LocationLoopService.IVAL_LOOP_SHORT;
import static com.fitsnitchapp.location_loop.LocationLoopService.IVAL_WILL_STAY;
import static com.fitsnitchapp.location_loop.LocationLoopService.beginSnitchWarning;
import static com.fitsnitchapp.location_loop.LocationLoopService.checkForRestaurant;

public class BaseState extends LoopState {
    @Override
    public long getInitialLoopIval() {
        return IVAL_LOOP_SHORT;
    }

    public void handleNewLocation(Location location) {
        LatLonPair triggerLocation = new LatLonPair(location.getLatitude(), location.getLongitude());

        checkForRestaurant(triggerLocation, (restaurant) -> {
            if(restaurant != null) {
                SnitchTrigger snitch = new SnitchTrigger(
                        System.currentTimeMillis(),
                        triggerLocation,
                        restaurant
                );
                beginSnitchWarning(snitch);
            }
            else {
                continueLoop(IVAL_LOOP_SHORT);
            }
        });

    }
}
