package com.fitsnitchapp;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.fitsnitchapp.location_loop.LocationLoopService;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class LocationModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "LocationManager";
    private static final String JS_EVENT_LOG = "JS_EVENT_LOG";
    private static final String JS_EVENT_LOG_MESSAGE = "JS_EVENT_LOG_MESSAGE";
    private static final String JS_EVENT_LOG_EXTRAS = "JS_EVENT_LOG_EXTRAS";
    private static final String CONST_JS_LOCATION_EVENT_NAME = "JS_LOCATION_EVENT_NAME";
    private static final String CONST_JS_LOCATION_LAT = "JS_LOCATION_LAT_KEY";
    private static final String CONST_JS_LOCATION_LON = "JS_LOCATION_LON_KEY";
    private static final String CONST_JS_LOCATION_TIME = "JS_LOCATION_TIME_KEY";

    private Gson gson;

    private static ReactApplicationContext rContext;
    private Intent mForegroundServiceIntent;

    LocationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        rContext = reactContext;
        gson = new Gson();
        mForegroundServiceIntent = new Intent(rContext, LocationForegroundService.class);
    }


    @Override
    public void initialize() {
        Log.i("******FIT", "STARTED LOCATION MODULE");
        MainActivity.registerLocationModule(this);
        super.initialize();
    }

    // JS Interface Methods
    @ReactMethod
    public void startBackgroundLocation() {
        Log.i("******FIT", "startBackgroundLocation");
        rContext.startForegroundService(mForegroundServiceIntent);
    }

    @ReactMethod
    public void stopBackgroundLocation() {
         rContext.stopService(mForegroundServiceIntent);
    }


    @ReactMethod
    public void getActiveSnitch(Callback cb) {
         cb.invoke(gson.toJson(LocationLoopService.getActiveSnitch()));
    };

//    @ReactMethod
//    public void setWillLeave() {
//        LocationLoopService.onWillLeave();
//    };

    @ReactMethod
    public void setUsedCheat() {
         LocationLoopService.onUsedCheat();
    };

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void saveUserId(String id) {
         new SettingsManager(rContext).saveItem(SettingsManager.USER_ID, id);
    };





    // JS Event Methods
    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
         constants.put(CONST_JS_LOCATION_EVENT_NAME, LocationForegroundService.JS_LOCATION_EVENT_NAME);
         constants.put(CONST_JS_LOCATION_LAT, LocationForegroundService.JS_LOCATION_LAT_KEY);
         constants.put(CONST_JS_LOCATION_LON, LocationForegroundService.JS_LOCATION_LON_KEY);
            constants.put(CONST_JS_LOCATION_TIME, LocationForegroundService.JS_LOCATION_TIME_KEY);
        constants.put(JS_EVENT_LOG, JS_EVENT_LOG);
        constants.put(JS_EVENT_LOG_MESSAGE, JS_EVENT_LOG_MESSAGE);
        constants.put(JS_EVENT_LOG_EXTRAS, JS_EVENT_LOG_EXTRAS);
        return constants;
    }

    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public static void sendEventToJS(String eventName, Bundle bundle) {
        WritableMap map = null;
        if (bundle != null) {
            map = bundleToMap(bundle);
        }
        sendEventToJS(eventName, map);
    }

    public static void sendEventToJS(String eventName, @Nullable WritableMap params) {
        rContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private static WritableMap bundleToMap(Bundle bundle) {
        WritableMap map = Arguments.createMap();
        Set<String> keys = bundle.keySet();
        for (String key : keys) {
            Object val = bundle.get(key);
            if (val == null) {
                map.putNull(key);
                continue;
            }
            String type = val.getClass().getSimpleName();
            if (type.equals("String")) {
                map.putString(key, (String) val);
            }
            if (type.equals("Integer")) {
                map.putInt(key, (Integer) val);
            }
            if (type.equals("Double")) {
                map.putDouble(key, (Double) val);
            }
            if (type.equals("Long")) {
                map.putDouble(key, ((Long)val).doubleValue());
            }
            if (type.equals("Boolean")) {
                map.putBoolean(key, (Boolean) val);
            }
            if (type.equals("Bundle")) {
                map.putMap(key, bundleToMap((Bundle) val));
            }
        }
        return map;
    }

    public static void JsLog(String message, Bundle extras) {
        Log.i("***FIT_LOC", message);
        if (extras != null) {
            Log.i("***FIT_LOC", new Gson().toJson(extras));
        }
        Bundle bundle = new Bundle();
        bundle.putLong("timestamp", System.currentTimeMillis());
        bundle.putString("message", message);
        bundle.putBundle("extras", extras);
        sendEventToJS(JS_EVENT_LOG, bundle);
    }

    public static void JsLog(String message) {
        JsLog(message, null);
    }
}
