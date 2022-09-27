package com.fitsnitchapp.api;

import com.fitsnitchapp.LatLonPair;

public class CheckLocationRequest {
    public LatLonPair location;

    public CheckLocationRequest(LatLonPair location) {
        this.location = location;
    }
}
