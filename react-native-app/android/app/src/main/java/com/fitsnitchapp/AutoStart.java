package com.fitsnitchapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

public class AutoStart extends BroadcastReceiver
{
    public static final String CHANNEL_ID = "FITSNITCH_SYSTEM_ALERTS";
    public static final String CHANNEL_NAME = "System Alerts";

    public void onReceive(Context context, Intent arg1)
    {
        Log.i("******FIT", "Did autostart here");

        NotificationChannel serviceChannel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
        );

        NotificationManager manager = context.getSystemService(NotificationManager.class);
        manager.createNotificationChannel(serviceChannel);

        manager.notify(0, createNotification(context));
        Log.i("******FIT", "After autostart");

    }


    static Notification createNotification(Context context) {
        Intent notificationIntent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        Notification n = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentIntent(pendingIntent)
                .setContentText("Uh-oh! Fitsnitch has stopped. Tap to restart!")
                .setSmallIcon(R.drawable.ic_launcher)
                .setAutoCancel(true)
                .build();

        n.flags |= Notification.FLAG_NO_CLEAR | Notification.FLAG_ONGOING_EVENT;
        return n;
    }

}