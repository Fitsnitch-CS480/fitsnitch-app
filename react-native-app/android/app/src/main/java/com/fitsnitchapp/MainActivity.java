package com.fitsnitchapp;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import expo.modules.ReactActivityDelegateWrapper;
import com.facebook.react.ReactActivityDelegate;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  private static LocationModule locationModule;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FitsnitchApp";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new TestActivityDelegate(this, getMainComponentName());
  }


  public static class TestActivityDelegate extends ReactActivityDelegate {


    private static final String TEST = "test";
    private Bundle mInitialProps = null;
    private final
    @Nullable
    Activity mActivity;

    public TestActivityDelegate(Activity activity, String mainComponentName) {
      super(activity, mainComponentName);
      this.mActivity = activity;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      Log.i("***FIT", "ON CREATE!!!!");
      mInitialProps = mActivity.getIntent().getExtras();
      if (mInitialProps != null) {
        Log.i("***FIT", "Intent Action: "+mInitialProps.getString("ACTION"));
      }
      super.onCreate(savedInstanceState);
    }

    @Override
    protected Bundle getLaunchOptions() {
      Log.i("***FIT", "LOADING PROPS");
      return mInitialProps;
    }
  }


  static public void registerLocationModule(LocationModule module) {
    locationModule = module;
  }

  static public void deRegisterLocationModule() {
    locationModule = null;
  }

  static boolean isOpen() {
    return locationModule != null;
  }

  @Override
  protected void onDestroy() {
    deRegisterLocationModule();
    super.onDestroy();
  }
}
