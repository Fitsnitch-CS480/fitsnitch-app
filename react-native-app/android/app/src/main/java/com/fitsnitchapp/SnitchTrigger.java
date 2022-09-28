package com.fitsnitchapp;

public class SnitchTrigger {
    public long created;
    public LatLonPair originCoords;
    public Restaurant restaurantData;

    public SnitchTrigger(long created, LatLonPair coords, Restaurant restaurantData) {
        this.created = created;
        this.originCoords = coords;
        this.restaurantData = restaurantData;
    }
}