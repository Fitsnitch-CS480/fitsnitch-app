package com.fitsnitchapp;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.IntentService;
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
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;

public class LaunchService extends IntentService {
    public static final String EXTRA_ACTION = "ACTION";
    public static final String ACTION_START_SNITCH = "START_SNITCH";

    public static Context mContext;

    public LaunchService() {
        super(LocationForegroundService.class.getName());
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mContext = getApplicationContext();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i("******FIT", "STARTED LAUNCH SERVICE");
        Bundle extras = intent.getExtras();
        if (extras != null) {
            Log.i("****FIT", String.valueOf(extras.getString("ACTION")));
        }

//        if (MainActivity.isOpen()) {
//            LocationModule.sendEventToJS("NEW_PROPS", extras);
//        }
//        else {
            Intent i = new Intent(getApplicationContext(), SnitchActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            i.putExtras(extras);
            getApplicationContext().startActivity(i);
//        }

        stopSelf();
        return START_NOT_STICKY;
    }

    @SuppressLint("MissingPermission")
    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.i("******FIT", "LAUNCH SERVICE INTENT!");
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

}
