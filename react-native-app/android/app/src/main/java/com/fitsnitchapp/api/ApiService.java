package com.fitsnitchapp.api;

import retrofit.RestAdapter;

public class ApiService {

    public static ApiInterface getClient() {
        RestAdapter adapter = new RestAdapter.Builder()
                .setEndpoint("https://13js1r8gt8.execute-api.us-west-2.amazonaws.com/dev") //Setting the Root URL
                .build(); //Finally building the adapter

        ApiInterface api = adapter.create(ApiInterface.class);
        return api;
    }
}
