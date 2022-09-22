package com.fitsnitchapp.api;

import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.Restaurant;

public class CreateSnitchRequest {
    public String userId;
    public LatLonPair originCoords;
    public Restaurant restaurantData;

    public CreateSnitchRequest(String userId, LatLonPair coords, Restaurant restaurantData) {
        this.userId = userId;
        this.originCoords = coords;
        this.restaurantData = restaurantData;
    }
}