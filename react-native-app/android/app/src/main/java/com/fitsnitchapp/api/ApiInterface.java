package com.fitsnitchapp.api;

import com.fitsnitchapp.CheckLocationResponse;
import com.fitsnitchapp.Restaurant;
import com.fitsnitchapp.SnitchTrigger;

import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;

public interface ApiInterface {
    @POST("/lambda/check-location") // specify the sub url for our base url
    public void checkLocation(
            @Body CheckLocationRequest request,
            Callback<CheckLocationResponse> callback
    );

    @POST("/snitch/publishNewSnitch") // specify the sub url for our base url
    public void publishSnitch(
            @Body CreateSnitchRequest snitch,
            Callback<Object> callback
    );
}
