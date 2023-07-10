package com.fitsnitchapp;

public class CheckLocationResponse {
    public Restaurant restaurant;
    public boolean isRestaurant;

    public CheckLocationResponse (Restaurant restaurant, boolean isRestaurant) {
        this.restaurant = restaurant;
        this.isRestaurant = isRestaurant;
    }
}
