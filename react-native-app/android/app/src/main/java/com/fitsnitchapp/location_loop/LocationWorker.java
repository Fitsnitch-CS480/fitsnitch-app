package com.fitsnitchapp.location_loop;

import static com.google.android.gms.location.LocationRequest.PRIORITY_HIGH_ACCURACY;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.work.ListenableWorker;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import androidx.work.impl.utils.futures.SettableFuture;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.CancellationToken;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnTokenCanceledListener;
import com.google.common.util.concurrent.ListenableFuture;

public class LocationWorker extends ListenableWorker {
    private final FusedLocationProviderClient mFusedLocationClient;
    Context mContext;

    public LocationWorker(
            @NonNull Context context,
            @NonNull WorkerParameters params) {
        super(context, params);
        mContext = context;
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getApplicationContext());
    }

    @NonNull
    @Override
    public ListenableFuture<Result> startWork() {
        SettableFuture<Result> future = SettableFuture.create();

        // Do the work here--in this case, upload the images.
        Log.i("***FIT_LOC", "Doing worker!!!");
//        LocationLoopService.requestNextJob(mContext, 1000, "do it again");
        inspectLocation();

        // Indicate whether the work finished successfully with the Result
//        return Result.success();
        future.set(Result.success());
        return future;
    }


    /**
     * Handles getting the location and passing it on to the main handler
     */
    private void inspectLocation() {
        Log.i("****FITLOC", "requesting current location");
        if (ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Log.e("***FIT_LOC", "Insufficient location permission!");
            return;
        }
        mFusedLocationClient.getCurrentLocation(PRIORITY_HIGH_ACCURACY, new CancellationToken() {
            @NonNull
            @Override
            public CancellationToken onCanceledRequested(@NonNull OnTokenCanceledListener onTokenCanceledListener) {
                return null;
            }

            @Override
            public boolean isCancellationRequested() {
                return false;
            }
        }).addOnSuccessListener(new OnSuccessListener<Location>() {
            @Override
            public void onSuccess(Location location) {
                Log.i("***FITLOC", "GOT LOCATION!!!");
                LocationLoopService.handleNewLocation(location);
            }
        });
    }
}
