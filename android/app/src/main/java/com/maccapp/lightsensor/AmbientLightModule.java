package com.maccapp.lightsensor;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AmbientLightModule extends ReactContextBaseJavaModule implements SensorEventListener {

    private final SensorManager mSensorManager;
    private final Sensor mSensorLight;
    private final ReactApplicationContext mReactContext;


    public AmbientLightModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        this.mSensorManager = (SensorManager) reactContext.getSystemService(reactContext.SENSOR_SERVICE);
        this.mSensorLight = mSensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);
    }

    private void sendEvent(@NonNull WritableMap params) {
        try {
            if (mReactContext != null) {
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("LightSensor", params);
            }
        } catch (RuntimeException e) {
            Log.d("ERROR", "error in sending ambient light sensor event");
        }
    }

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        Log.d("AMBIENT LIGHT", "Value: " + sensorEvent.values[0]);
        WritableMap sensorMap = Arguments.createMap();
        float lightSensorValue = sensorEvent.values[0];
        sensorMap.putDouble("lightValue", lightSensorValue);
        sendEvent(sensorMap);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }

    @NonNull
    @Override
    public String getName() {
        return "AmbientLightModule";
    }

    @ReactMethod
    public void startLightSensor() {
        if (mSensorLight == null) {
            return;
        }
        mSensorManager.registerListener(this, mSensorLight, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @ReactMethod
    public void stopLightSensor() {
        if (mSensorLight == null) {
            return;
        }
        mSensorManager.unregisterListener(this);
    }
}
