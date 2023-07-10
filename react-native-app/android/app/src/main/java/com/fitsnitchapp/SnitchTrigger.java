package com.fitsnitchapp;

public class SnitchTrigger {
    public long created_at;
    public LatLonPair originCoords;
    public Restaurant restaurantData;

    public SnitchTrigger(long created_at, LatLonPair coords, Restaurant restaurantData) {
        this.created_at = created_at;
        this.originCoords = coords;
        this.restaurantData = restaurantData;
    }
}