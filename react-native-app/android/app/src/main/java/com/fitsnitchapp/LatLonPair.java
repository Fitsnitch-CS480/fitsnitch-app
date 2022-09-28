package com.fitsnitchapp;

import android.location.Location;

import java.util.HashMap;
import java.util.Map;

public class LatLonPair {
    public double lat;
    public double lon;

    public LatLonPair(double lat, double lon) {
        this.lat = lat;
        this.lon = lon;
    }

    public static LatLonPair fromLocation(Location loc) {
        return new LatLonPair(loc.getLatitude(), loc.getLongitude());
    }
}