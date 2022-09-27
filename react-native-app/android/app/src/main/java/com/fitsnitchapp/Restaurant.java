package com.fitsnitchapp;

import java.util.HashMap;
import java.util.Map;

public class Restaurant {
    public String name;
    public LatLonPair location;

    public Restaurant(String name, LatLonPair location) {
        this.name = name;
        this.location = location;
    }
}