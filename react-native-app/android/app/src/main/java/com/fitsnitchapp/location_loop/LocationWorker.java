package com.fitsnitchapp.location_loop;

import static com.fitsnitchapp.LocationModule.JsLog;
import static com.google.android.gms.location.LocationRequest.PRIORITY_HIGH_ACCURACY;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.CancellationToken;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnTokenCanceledListener;

import java.util.Set;

public class LocationWorker extends Worker {
    private final FusedLocationProviderClient mFusedLocationClient;
    Context mContext;
    Set<String> tags;

    public LocationWorker(
            @NonNull Context context,
            @NonNull WorkerParameters params) {
        super(context, params);
        mContext = context;
        tags = params.getTags();
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getApplicationContext());
    }

    @NonNull
    @Override
    public Result doWork() {
        if (!LocationLoopManager.getInstance().isDoingLoop) {
            JsLog("Loop was stopped - skipping worker");
            return Result.failure();
        }
        inspectLocation();

        return Result.success();
    }


    /**
     * Handles getting the location and passing it on to the main handler
     */
    private void inspectLocation() {
        JsLog("requesting current location");
        if (ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            JsLog("Insufficient location permission!");
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
                LocationLoopManager.getInstance().handleNewLocation(location);
            }
        });
    }
}
