package com.fitsnitchapp.location_loop;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.Build;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.util.Consumer;

import com.fitsnitchapp.BuildConfig;
import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.LocationForegroundService;
import com.fitsnitchapp.R;
import com.fitsnitchapp.Restaurant;
import com.fitsnitchapp.SettingsManager;
//import com.fitsnitchapp.SnitchActivity;
import com.fitsnitchapp.SnitchActivity;
import com.fitsnitchapp.SnitchTrigger;
//import com.fitsnitchapp.api.ApiService;
//import com.fitsnitchapp.api.CheckLocationRequest;
//import com.fitsnitchapp.api.CreateSnitchRequest;
import com.fitsnitchapp.api.ApiService;
import com.fitsnitchapp.api.CheckLocationRequest;
import com.fitsnitchapp.api.CreateSnitchRequest;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class LocationLoopService extends IntentService {
    private static final String CHANNEL_ID = "FITSNITCH_SNITCHES";
    private static final String CHANNEL_NAME = "Active Snitch Warnings";
    private static AlarmManager mAlarmManager;
    private static LoopState loopState = new BaseState();
    private static PendingIntent pendingLoopIntent;
    private static Notification warningNotification;
    private static Notification snitchedNotification;
    private static SettingsManager settingsManager;
    private static NotificationChannel mNotificationChannel;
    private FusedLocationProviderClient mFusedLocationClient;
    private static LocationCallback mLocationCallback;
    private static NotificationManager notificationManager;
    private static Gson mGson;

    private static final int NOTIF_ID_WARNING = 0;
    private static final int NOTIF_ID_SNITCHED = 1;

    private static long nextLocationAlarmTime;

    // Default values for PROD (overwritten for DEV below)
    public static long IVAL_WARNING = 30000; // 30 seconds
    public static long IVAL_LOOP_SHORT = 60000; // 1 minute
    // public static long IVAL_LOOP_LONG = 30000;
    public static long IVAL_WILL_LEAVE = 30000;
    public static long IVAL_WILL_STAY = 60000 * 10; // 10 minutes

    public static final double SIGNIFICANT_RADIUS = 0.00001f;

    private static Location lastLocation;
    private static SnitchTrigger activeSnitch;
    private static Long lastWillLeaveTime;
    private static Long lastUsedCheatTime;

    public LocationLoopService() {
        super(LocationForegroundService.class.getName());
        mGson = new Gson();

        if (BuildConfig.BUILD_TYPE == "debug") {
            Log.i("***FIT", "Setting short loop times for debug");
            IVAL_WARNING = 30000; // 30 seconds
            IVAL_LOOP_SHORT = 30000; // 30 seconds
            IVAL_WILL_LEAVE = 30000; // 30 seconds
            IVAL_WILL_STAY = 60000; // 1 minute
        }
    }

    public static SnitchTrigger getActiveSnitch() {
        Log.i("***FIT", String.valueOf(activeSnitch));
        return activeSnitch;
    }

    /**
     * Creates a new loop (alarm) with a new state. This method handles setting
     * a new alarm, so the previous loop should not do that if it plan to
     * use this method to change state.
     *
     * Uses the new state to determine the interval for the new loop.
     * Defaults to IVAL_LOOP_SHORT
     * @param newState
     */
    public static void enterLoopState(LoopState newState) {
        Log.i("***FITLOC", "Entering loop state: "+newState.getClass().getSimpleName());
        loopState = newState;
        long ival = newState.getInitialLoopIval();
        if (ival == 0) {
            ival = IVAL_LOOP_SHORT;
        }
        setNextAlarm(ival);
    }

    /**
     * Called when a new intent is received, either to begin
     * or continue the loop.
     * The Application Context is not guaranteed to exist before this time,
     * so some setup must happen here.
     * @param intent
     */
    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.i("****FITLOC","Received loop intent");
        setup();
        inspectLocation();
    }

    private void setup() {
        // This one must be recreated each time
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getApplicationContext());

        // If any of these exist it is safe to assume they all do.
        if (mAlarmManager != null) return;
        mAlarmManager = (AlarmManager) LocationForegroundService.mContext.getSystemService(Context.ALARM_SERVICE);
        settingsManager = new SettingsManager(getApplicationContext());

        Intent loopIntent = new Intent(getApplicationContext(), LocationLoopService.class);
        pendingLoopIntent = PendingIntent.getService(getApplicationContext(), 1, loopIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        notificationManager = LocationForegroundService.mContext.getSystemService(NotificationManager.class);
        mNotificationChannel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
        );
        notificationManager.createNotificationChannel(mNotificationChannel);

        createWarningNotification();
        createSnitchedNotification();
    }


    /**
     * Ends one iteration of the loop by setting the alarm
     * that will trigger the next.
     * Only call this once per iteration!
     * @param ival How long to wait before the next iteration.
     */
    static void setNextAlarm(long ival) {
        nextLocationAlarmTime = System.currentTimeMillis() + ival;
        mAlarmManager.setExact(
                AlarmManager.RTC,
                nextLocationAlarmTime,
                pendingLoopIntent
        );
        Log.i("***FIT", "next alarm in "+ival);
    }

    /**
     * Handles getting the location and passing it on to the main handler
     */
    @SuppressLint("MissingPermission")
    private void inspectLocation() {
        Log.i("****FITLOC","requesting current location");

        LocationRequest locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(0)
                .setFastestInterval(0);

        mLocationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(@NonNull LocationResult locationResult) {
                Log.i("****FITLOC","got location");

                Location newLocation = locationResult.getLastLocation();
                handleNewLocation(newLocation);
                mFusedLocationClient.removeLocationUpdates(mLocationCallback);
            }
        };

        new Handler(getMainLooper()).post(() -> mFusedLocationClient.requestLocationUpdates(
                locationRequest,
                mLocationCallback,
                getMainLooper()
        ));
    }

    /**
     * The main body of logic for each loop.
     * Determines what to do based on current location and variables.
     * All paths MUST terminate with a call to setNextAlarm to keep
     * the loop going.
     */
    private void handleNewLocation(Location newLocation) {
        Log.i("***FITLOC", "Handling new location");
        loopState.handleNewLocation(newLocation);

        // Save new location if change is significant
        if (lastLocation != null) {
            boolean didChange = didLocationChange(newLocation);
            if (didChange) {
                lastLocation = newLocation;
            }
        }
        else {
            lastLocation = newLocation;
        }
    }


    static boolean didLocationChange(Location newLocation) {
        return didLocationChange(newLocation, SIGNIFICANT_RADIUS);
    }

    static boolean didLocationChange(Location newLocation, double sig_radius) {
        double newLat = newLocation.getLatitude();
        double newLon = newLocation.getLongitude();
        double oldLat = lastLocation.getLatitude();
        double oldLon = lastLocation.getLongitude();

        Log.i("********FIT", "lat:" + String.valueOf(newLat) + "      Lon: " + String.valueOf(newLon));
        Log.i("********FIT", "speed:" + String.valueOf(newLocation.getSpeed()));

        double distance = Math.sqrt( Math.pow(newLon - oldLon, 2) + Math.pow(newLat - oldLat, 2) );

        Log.i("********FIT", "dist:" + String.valueOf(distance));
        Log.i("********FIT", String.valueOf(distance >= sig_radius));

        return distance >= sig_radius;
    }


    /**
     * Handles the API request for restaurants.
     * Returns null for any error.
     * @param location
     * @param cb
     */
    public static void checkForRestaurant(LatLonPair location, Consumer<Restaurant> cb) {
        ApiService.getClient().checkLocation(new CheckLocationRequest(location), new Callback<Restaurant>() {
            @Override
            public void success(Restaurant restaurant, Response response) {
                Log.i("*****FIT CHECK LOCATION", restaurant.name);
                cb.accept(restaurant);
            }

            @Override
            public void failure(RetrofitError error) {
                Log.i("*****FIT CHECK LOCATION", error.getResponse().getReason());
                cb.accept(null);
            }
        });
    }

    /**
     * HANDLES ENTERING NEW STATE!
     * Do not call enterLoopState when using this method.
     *
     * Handles all setup for snitch warning state.
     * @param snitch
     */
    static void beginSnitchWarning(SnitchTrigger snitch) {
        Log.i("***FIT", "Entering Snitch State!");
        activeSnitch = snitch;
        sendWarningNotification();
        enterLoopState(new ActiveSnitchState());
        // BUG: Snitch triggers irregularly - sometimes 40 seconds, sometimes 15
    }


    public static void onUsedCheat() {
        lastUsedCheatTime = System.currentTimeMillis();
        Log.i("***FIT", "SET USED CHEAT" + String.valueOf(lastUsedCheatTime));
    }

    public static boolean usedCheatForActiveSnitch() {
        return lastUsedCheatTime != null && activeSnitch != null && lastUsedCheatTime > activeSnitch.created;
    }

    static void publishActiveSnitch() {
        String userId = settingsManager.getItem(SettingsManager.USER_ID);
        Log.i("****FIT", "SENDING SNITCH!! "+userId);
        CreateSnitchRequest request = new CreateSnitchRequest(userId, activeSnitch.originCoords, activeSnitch.restaurantData);
        ApiService.getClient().publishSnitch(request, new Callback<Object>() {
            @Override
            public void success(Object obj, Response response) {
                Log.i("***FIT", "SUCCESS");
            }

            @Override
            public void failure(RetrofitError error) {
                Log.i("***FIT", "ERROR Could not send snitch");
                Log.i("***FIT", error.getLocalizedMessage());
            }
        });

        notificationManager.cancel(NOTIF_ID_WARNING);
        sendSnitchedNotification();
        activeSnitch = null;
        lastUsedCheatTime = null;
    }



    private void createWarningNotification() {
        Intent notificationIntent = new Intent(getApplicationContext(), SnitchActivity.class);
        notificationIntent.putExtra("ACTION", "START_SNITCH");
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingNotifIntent = PendingIntent.getActivity(getApplicationContext(), NOTIF_ID_WARNING, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        warningNotification = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setContentIntent(pendingNotifIntent)
                .setContentText("You'll be snitched on in 30 seconds!")
                .setSmallIcon(R.drawable.ic_logo_pin)
                .setAutoCancel(true)
                .setPriority(2)
                .build();

        warningNotification.flags |= Notification.FLAG_NO_CLEAR | Notification.FLAG_ONGOING_EVENT;
    }

    private void createSnitchedNotification() {
        Intent notificationIntent = new Intent(getApplicationContext(), SnitchActivity.class);
        notificationIntent.putExtra("ACTION", "DID_SNITCH");
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingNotifIntent = PendingIntent.getActivity(getApplicationContext(), NOTIF_ID_SNITCHED, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        snitchedNotification = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setContentIntent(pendingNotifIntent)
                .setContentText("You've been snitched on!")
                .setSmallIcon(R.drawable.ic_logo_pin)
                .setAutoCancel(true)
                .setPriority(2)
                .build();
    }

    static void sendWarningNotification() {
        notificationManager.createNotificationChannel(mNotificationChannel);
        notificationManager.notify(0, warningNotification);
    }

    static void sendSnitchedNotification() {
        notificationManager.notify(NOTIF_ID_SNITCHED, snitchedNotification);
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}
