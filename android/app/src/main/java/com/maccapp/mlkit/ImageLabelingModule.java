package com.maccapp.mlkit;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ImageLabelingModule extends ReactContextBaseJavaModule {

    public ImageLabelingModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "ImageLabelingModule";
    }

    @ReactMethod
    public void labelImage(String url) {
        Log.d("Image Labeling", "Url: " + url);
    }
}
