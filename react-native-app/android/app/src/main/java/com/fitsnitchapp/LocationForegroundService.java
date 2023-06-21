package com.fitsnitchapp;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.fitsnitchapp.location_loop.LocationLoopService;
import com.google.gson.Gson;

public class LocationForegroundService extends Service {
    public static final String CHANNEL_ID_BG = "FITSNITCH_BG";
    public static final String CHANNEL_NAME_BG = "Background Activity Status";
    public static final int NOTIFICATION_ID = 1;
    public static final String JS_LOCATION_LAT_KEY = "latitude";
    public static final String JS_LOCATION_LON_KEY = "longitude";
    public static final String JS_LOCATION_TIME_KEY = "timestamp";
    public static final String JS_LOCATION_EVENT_NAME = "location_received";

    private Gson mGson;
    public static Context mContext;


    @Override
    public void onCreate() {
        Log.i("******FIT", "CREATED LOCATION FOREGROUND SERVICE");
        super.onCreate();
        mGson = new Gson();
        mContext = getApplicationContext();
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
        Log.i("***FIT_LOC", "Starting loop from foreground");
        new LocationLoopService().startLoop(getApplicationContext());
    }


    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        stopSelf();
        super.onDestroy();
    }

    static void createNotificationChannel() {
        NotificationChannel serviceChannel = new NotificationChannel(
                CHANNEL_ID_BG,
                CHANNEL_NAME_BG,
                NotificationManager.IMPORTANCE_MIN
        );

        NotificationManager manager = mContext.getSystemService(NotificationManager.class);
        manager.createNotificationChannel(serviceChannel);
    }

    static Notification createNotification() {
        Intent notificationIntent = new Intent(mContext, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(mContext, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        return new NotificationCompat.Builder(mContext, CHANNEL_ID_BG)
                .setContentIntent(pendingIntent)
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentText("FitSnitch is running. We'll help you keep your goals!")
                .setSilent(true)
                .build();
    }


}
