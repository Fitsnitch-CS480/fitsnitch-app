package com.fitsnitchapp.location_loop;

import static com.fitsnitchapp.LocationModule.JsLog;
import static io.invertase.firebase.app.ReactNativeFirebaseApp.getApplicationContext;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.location.Location;

import androidx.core.app.NotificationCompat;
import androidx.core.util.Consumer;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkRequest;

import com.fitsnitchapp.BuildConfig;
import com.fitsnitchapp.CheckLocationResponse;
import com.fitsnitchapp.LatLonPair;
import com.fitsnitchapp.LocationForegroundService;
import com.fitsnitchapp.R;
import com.fitsnitchapp.Restaurant;
import com.fitsnitchapp.SettingsManager;
import com.fitsnitchapp.SnitchActivity;
import com.fitsnitchapp.SnitchTrigger;
import com.fitsnitchapp.api.ApiService;
import com.fitsnitchapp.api.CheckLocationRequest;
import com.fitsnitchapp.api.CreateSnitchRequest;

import java.util.concurrent.TimeUnit;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class LocationLoopManager {
    private static final LocationLoopManager _instance = new LocationLoopManager();
    private static final String CHANNEL_ID = "FITSNITCH_SNITCHES";
    private static final String CHANNEL_NAME = "Active Snitch Warnings";

    public static final String WORKER_TAG = "FIT_LOC_WORKER";

    public boolean isDoingLoop = false;
    private LoopState loopState;
    private Notification warningNotification;
    private Notification snitchedNotification;
    private SettingsManager settingsManager;
    private NotificationChannel mNotificationChannel;
    private NotificationManager notificationManager;
    private final int NOTIF_ID_WARNING = 0;
    private final int NOTIF_ID_SNITCHED = 1;




    // Default values for PROD (overwritten for DEV below)
    public static long IVAL_WARNING = 30000; // 30 seconds
    public static long IVAL_LOOP_SHORT = 60000; // 1 minute
    // public static long IVAL_LOOP_LONG = 30000;
    public static long IVAL_WILL_LEAVE = 30000;
    public static long IVAL_WILL_STAY = 10 * 60000; // 10 minutes

    public static final double SIGNIFICANT_RADIUS = 0.00001f;




    private Location lastLocation;
    private SnitchTrigger activeSnitch;
    private Long lastWillLeaveTime;
    private Long lastUsedCheatTime;

    private LocationLoopManager() {
        if (BuildConfig.BUILD_TYPE == "debug") {
            JsLog("Setting short loop times for debug");
            IVAL_WARNING = 30000; // 30 seconds
            IVAL_LOOP_SHORT = 30000; // 30 seconds
            IVAL_WILL_LEAVE = 30000; // 30 seconds
            IVAL_WILL_STAY = 60000; // 1 minute
        }
    }

    public static LocationLoopManager getInstance() {
        return _instance;
    }

    public void startLoop(Context context) {
        if (isDoingLoop) {
            JsLog("Location loop already running");
            return;
        }
        setup(context);
        enterLoopState(new BaseState());
        isDoingLoop = true;
    }

    public void stopLoop() {
        JsLog("Stopping location loop");
        isDoingLoop = false;
    }

    public SnitchTrigger getActiveSnitch() {
        JsLog(String.valueOf(activeSnitch));
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
    public void enterLoopState(LoopState newState) {
        JsLog("Entering loop state: " + newState.getClass().getSimpleName());
        loopState = newState;
        long ival = newState.getInitialLoopIval();
        if (ival == 0) {
            ival = IVAL_LOOP_SHORT;
        }
        requestNextJob(getApplicationContext(), ival);
    }


    private void setup(Context context) {
        settingsManager = new SettingsManager(context);


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
     *
     * @param ival How long to wait before the next iteration.
     */
    void setNextAlarm(long ival) {
        requestNextJob(getApplicationContext(), ival);
    }


    void requestNextJob(Context context, long delay) {
        JsLog("Requesting location worker," + " " + loopState.getClass().getSimpleName() + ", " + delay);
        WorkRequest locationWorkRequest =
                new OneTimeWorkRequest.Builder(LocationWorker.class)
                        .setInitialDelay(delay, TimeUnit.MILLISECONDS)
                        .addTag(WORKER_TAG)
                        .addTag(loopState.getClass().getSimpleName())
                        .build();
        WorkManager
                .getInstance(context)
                .enqueue(locationWorkRequest);
    }


    /**
     * The main body of logic for each loop.
     * Determines what to do based on current location and variables.
     * All paths MUST terminate with a call to setNextAlarm to keep
     * the loop going.
     */
    void handleNewLocation(Location newLocation) {
        if (loopState == null) {
            loopState = new BaseState();
        }
        JsLog("Handling new location: " + loopState.getClass().getSimpleName());
        boolean didChange = didLocationChange(newLocation, true);

        loopState.handleNewLocation(newLocation);

        // Save new location if change is significant
        if (didChange) {
            lastLocation = newLocation;
        }
        else if (lastLocation == null) {
            lastLocation = newLocation;
        }
    }


    boolean didLocationChange(Location newLocation) {
        return didLocationChange(newLocation, SIGNIFICANT_RADIUS, false);
    }
    boolean didLocationChange(Location newLocation, boolean printLogs) {
        return didLocationChange(newLocation, SIGNIFICANT_RADIUS, printLogs);
    }



    boolean didLocationChange(Location newLocation, double sig_radius, boolean printLogs) {
        if (lastLocation == null) {
            JsLog("No previous location");
            return false;
        }
        double newLat = newLocation.getLatitude();
        double newLon = newLocation.getLongitude();
        double oldLat = lastLocation.getLatitude();
        double oldLon = lastLocation.getLongitude();

        double distance = Math.sqrt(Math.pow(newLon - oldLon, 2) + Math.pow(newLat - oldLat, 2));
        boolean didChange = distance >= sig_radius;

        if (printLogs) {
            JsLog("Handling new location: " + loopState.getClass().getSimpleName());
            JsLog("Loc: " + String.valueOf(newLocation.getLatitude()) + ", " + String.valueOf(newLocation.getLongitude() + ". Speed: " + String.valueOf(newLocation.getSpeed()) + "m/s"));
            JsLog("Distance moved: " + String.format("%.6f",distance) + ". Significant: " + String.valueOf(didChange));
        }

        return didChange;
    }


    /**
     * Handles the API request for restaurants.
     * Returns null for any error.
     *
     * @param location
     * @param cb
     */
    public static void checkForRestaurant(LatLonPair location, Consumer<Restaurant> cb) {
        ApiService.getClient().checkLocation(new CheckLocationRequest(location), new Callback<CheckLocationResponse>() {
            @Override
            public void success(CheckLocationResponse responseData, Response response) {
                if (responseData.isRestaurant) {
                    JsLog("Is at restaurant: " + responseData.restaurant.name);
                    cb.accept(responseData.restaurant);
                }
                else {
                    JsLog("Found no restaurant");
                    cb.accept(null);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                JsLog("RetroFit error:" + error.getMessage());
                cb.accept(null);
            }
        });
    }

    /**
     * HANDLES ENTERING NEW STATE!
     * Do not call enterLoopState when using this method.
     *
     * Handles all setup for snitch warning state.
     *
     * @param snitch
     */
    void beginSnitchWarning(SnitchTrigger snitch) {
        JsLog("Entering Snitch State!");
        activeSnitch = snitch;
        sendWarningNotification();
        enterLoopState(new ActiveSnitchState());
    }


    public void onUsedCheat() {
        lastUsedCheatTime = System.currentTimeMillis();
        JsLog("SET USED CHEAT" + String.valueOf(lastUsedCheatTime));
    }

    public boolean usedCheatForActiveSnitch() {
        return lastUsedCheatTime != null && activeSnitch != null && lastUsedCheatTime > activeSnitch.created_at;
    }

    void publishActiveSnitch() {
        String userId = settingsManager.getItem(SettingsManager.USER_ID);
        JsLog("SENDING SNITCH!! " + userId);
        CreateSnitchRequest request = new CreateSnitchRequest(userId, activeSnitch.originCoords, activeSnitch.restaurantData);
        ApiService.getClient().publishSnitch(request, new Callback<Object>() {
            @Override
            public void success(Object obj, Response response) {
                JsLog("SUCCESS");
            }

            @Override
            public void failure(RetrofitError error) {
                JsLog("ERROR Could not send snitch");
                JsLog(error.getLocalizedMessage());
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
        PendingIntent pendingNotifIntent = PendingIntent.getActivity(getApplicationContext(), NOTIF_ID_WARNING, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        warningNotification = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setContentIntent(pendingNotifIntent)
                .setContentText("You'll be snitched on in 30 seconds!")
                .setSmallIcon(R.drawable.ic_launcher)
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
        PendingIntent pendingNotifIntent = PendingIntent.getActivity(getApplicationContext(), NOTIF_ID_SNITCHED, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        snitchedNotification = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setContentIntent(pendingNotifIntent)
                .setContentText("You've been snitched on!")
                .setSmallIcon(R.drawable.ic_launcher)
                .setAutoCancel(true)
                .setPriority(2)
                .build();
    }

    void sendWarningNotification() {
        notificationManager.createNotificationChannel(mNotificationChannel);
        notificationManager.notify(0, warningNotification);
    }

    void sendSnitchedNotification() {
        notificationManager.notify(NOTIF_ID_SNITCHED, snitchedNotification);
    }

}
