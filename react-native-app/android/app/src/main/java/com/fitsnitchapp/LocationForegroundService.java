package com.fitsnitchapp;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.fitsnitchapp.location_loop.LocationLoopService;
import com.google.gson.Gson;

public class LocationForegroundService extends Service implements LocationEventReceiver {
    public static final String CHANNEL_ID_BG = "FITSNITCH_BG";
    public static final String CHANNEL_NAME_BG = "Background Activity Status";
    public static final int NOTIFICATION_ID = 1;
    public static final String LOCATION_EVENT_NAME = "com.rnbglocation.LOCATION_INFO";
    public static final String LOCATION_EVENT_DATA_NAME = "LocationData";
    public static final int LOCATION_UPDATE_INTERVAL = 15000;
    public static final String JS_LOCATION_LAT_KEY = "latitude";
    public static final String JS_LOCATION_LON_KEY = "longitude";
    public static final String JS_LOCATION_TIME_KEY = "timestamp";
    public static final String JS_LOCATION_EVENT_NAME = "location_received";

    private AlarmManager mAlarmManager;
    private BroadcastReceiver mEventReceiver;
    private PendingIntent locationLoopIntent;
    private Gson mGson;
    public static Context mContext;


    @Override
    public void onCreate() {
        super.onCreate();
        mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        mGson = new Gson();
        mContext = getApplicationContext();
        createEventReceiver();
        registerEventReceiver();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();
        startForeground(NOTIFICATION_ID, createNotification());
        Log.i("******FIT", "STARTED LOCATION FOREGROUND SERVICE");

        startLocationLoop();

        return START_STICKY;
    }

    private void startLocationLoop() {
        Intent i = new Intent(getApplicationContext(), LocationLoopService.class);
        PendingIntent locationLoopIntent = PendingIntent.getService(getApplicationContext(), 1, i, PendingIntent.FLAG_UPDATE_CURRENT);

        mAlarmManager.setExact(
                AlarmManager.RTC,
                System.currentTimeMillis() + 5000,
                locationLoopIntent
        );
    }



    @Override
    public void createEventReceiver() {
        mEventReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
//                LocationUpdate newLocation = mGson.fromJson(
//                        intent.getStringExtra(LOCATION_EVENT_DATA_NAME), LocationUpdate.class);


            }
        };
    }


//    private void sendLocationToJs(LocationUpdate location) {
//        WritableMap eventData = Arguments.createMap();
//        eventData.putDouble(
//                JS_LOCATION_LAT_KEY,
//                location.getLatitude());
//        eventData.putDouble(
//                JS_LOCATION_LON_KEY,
//                location.getLongitude());
//        eventData.putDouble(
//                JS_LOCATION_TIME_KEY,
//                location.getTimestamp());
//        // if you actually want to send events to JS side, it needs to be in the "Module"
////                sendEventToJS(getReactApplicationContext(),
////                        JS_LOCATION_EVENT_NAME, eventData);
//
//    }

    @Override
    public void registerEventReceiver() {
        IntentFilter eventFilter = new IntentFilter();
        eventFilter.addAction(LOCATION_EVENT_NAME);
        registerReceiver(mEventReceiver, eventFilter);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        unregisterReceiver(mEventReceiver);
        if (locationLoopIntent != null) {
            mAlarmManager.cancel(locationLoopIntent);
        }
        stopSelf();
        super.onDestroy();
    }

    static void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID_BG,
                    CHANNEL_NAME_BG,
                    NotificationManager.IMPORTANCE_MIN
            );

            NotificationManager manager = mContext.getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }

    static Notification createNotification() {
        Intent notificationIntent = new Intent(mContext, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(mContext, 0, notificationIntent, 0);

        return new NotificationCompat.Builder(mContext, CHANNEL_ID_BG)
                .setContentIntent(pendingIntent)
                .setSmallIcon(R.drawable.ic_logo_pin)
                .setContentText("FitSnitch is running. We'll help you keep your goals!")
                .setSilent(true)
                .build();
    }


}