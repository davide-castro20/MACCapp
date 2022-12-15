package com.maccapp.location;

import android.graphics.Bitmap;
import android.graphics.Rect;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.Continuation;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.functions.FirebaseFunctions;
import com.google.firebase.functions.HttpsCallableResult;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;


public class LocationModule extends ReactContextBaseJavaModule {

    private FirebaseFunctions mFunctions;

    public LocationModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationModule";
    }

    @ReactMethod
    public void convertToLocation(int latitude, int longitude, Promise promise) {
        Log.d("Location", "");


        mFunctions = FirebaseFunctions.getInstance();

        //mFunctions.useEmulator("10.0.2.2", 5001);

        JsonObject request = new JsonObject();
        request.add("latitude", new JsonPrimitive(latitude));
        request.add("longitude", new JsonPrimitive(longitude));

        getLocationName(request.toString())
                .addOnCompleteListener(new OnCompleteListener<JsonElement>() {
                    @Override
                    public void onComplete(@NonNull Task<JsonElement> task) {
                        if (!task.isSuccessful()) {
                            Log.d("GetLocationNameFAILED",task.getException().toString());

                        } else {
                            Log.d("LOCATION SUCCESS", task.getResult().getAsJsonArray().toString());

                            promise.resolve(task.getResult().getAsJsonArray().get(0).toString());
                        }
                    }
                });
    }

    private Task<JsonElement> getLocationName(String requestJson) {
        return mFunctions
                .getHttpsCallable("convertToLocationName")
                .call(requestJson)
                .continueWith(new Continuation<HttpsCallableResult, JsonElement>() {
                    @Override
                    public JsonElement then(@NonNull Task<HttpsCallableResult> task) {
                        // This continuation runs on either success or failure, but if the task
                        // has failed then getResult() will throw an Exception which will be
                        // propagated down.
                        return JsonParser.parseString(new Gson().toJson(task.getResult().getData()));
                    }
                });
    }

}

