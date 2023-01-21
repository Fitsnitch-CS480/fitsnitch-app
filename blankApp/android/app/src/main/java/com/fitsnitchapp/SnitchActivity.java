package com.fitsnitchapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

public class SnitchActivity extends ReactActivity {

  private static LocationModule locationModule;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SnitchActivity";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new TestActivityDelegate(this, getMainComponentName());
  }


  public static class TestActivityDelegate extends ReactActivityDelegate {

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
        Log.i("***FIT", "Intent Action: "+mInitialProps.getString("META_DATA"));
      }
      super.onCreate(savedInstanceState);
    }

    @Override
    public boolean onNewIntent(Intent intent) {
      Log.i("***FIT", "NEW INTENT!");
      mInitialProps = mActivity.getIntent().getExtras();
      if (mInitialProps != null) {
        Log.i("***FIT", "Snitch Activity: Intent Action: "+mInitialProps.getString("META_DATA"));
        LocationModule.sendEventToJS("NEW_PROPS", mInitialProps);
      }
      return super.onNewIntent(intent);
    }

    @Override
    protected Bundle getLaunchOptions() {
      Log.i("***FIT", "Snitch Activity: LOADING PROPS");
      return mInitialProps;
    }
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
  }
}
