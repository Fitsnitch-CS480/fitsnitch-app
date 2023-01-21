package com.fitsnitchapp.api;

import android.util.Log;

import com.fitsnitchapp.BuildConfig;

import retrofit.RestAdapter;

public class ApiService {

    public static ApiInterface getClient() {
        Log.i("***FIT", "API_URL: "+"BuildConfig.API_URL");
        RestAdapter adapter = new RestAdapter.Builder()
                .setEndpoint("BuildConfig.API_URL") //Setting the Root URL
                .build(); //Finally building the adapter

        ApiInterface api = adapter.create(ApiInterface.class);
        return api;
    }
}
