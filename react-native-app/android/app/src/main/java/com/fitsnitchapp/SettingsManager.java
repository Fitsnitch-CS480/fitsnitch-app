package com.fitsnitchapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.RequiresApi;

public class SettingsManager {
    private final SharedPreferences settings;

    public SettingsManager(Context ctx) {
        settings = ctx.getSharedPreferences(PREFS_NAME, 0);
    }

    private final String PREFS_NAME = "FITSNITCHAPP_SETTINGS";

    public static SettingItem USER_ID = new SettingItem("USER_ID", String.class.getTypeName());

    public void saveItem(SettingItem setting, Object value) {
        SharedPreferences.Editor editor = settings.edit();
        if (setting.type.equals(String.class.getTypeName()))
            editor.putString(setting.name, (String) value);
        // TODO support more types....

        // Apply the edits!
        editor.apply();
    }


    // Get from the SharedPreferences
    public <T> T getItem(SettingItem setting) {
        T value = null;
        if (setting.type.equals(String.class.getTypeName())) value = (T) settings.getString(setting.name, null);
        return value;
    }


    public static class SettingItem {
        public final String name;
        public final String type;

        private SettingItem(String name, String type) {
            this.name = name;
            this.type = type;
        }
    }
}