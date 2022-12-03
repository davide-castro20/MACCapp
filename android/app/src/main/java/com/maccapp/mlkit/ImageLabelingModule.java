package com.maccapp.mlkit;

import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
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

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class ImageLabelingModule extends ReactContextBaseJavaModule {

    private FirebaseFunctions mFunctions;

    public ImageLabelingModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "ImageLabelingModule";
    }

    @ReactMethod
    public void labelImage(String uriString) {
        Log.d("ImageLabeling", "Uri: " + uriString);

        Uri uri = Uri.parse(uriString);

        Bitmap bitmap = null;
        try {
            bitmap = MediaStore.Images.Media.getBitmap(getReactApplicationContext().getContentResolver(), uri);
        } catch (IOException e) {
            e.printStackTrace();
            Log.d("ImageLabelingError", "");
            return;
        }

        // Convert bitmap to base64 encoded string
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] imageBytes = byteArrayOutputStream.toByteArray();
        String base64encoded = Base64.encodeToString(imageBytes, Base64.NO_WRAP);

        mFunctions = FirebaseFunctions.getInstance();

        // Create json request to cloud vision
        JsonObject request = new JsonObject();
        // Add image to request
        JsonObject image = new JsonObject();
        image.add("content", new JsonPrimitive(base64encoded));
        request.add("image", image);
        //Add features to the request
        JsonObject feature = new JsonObject();
        feature.add("maxResults", new JsonPrimitive(5));
        feature.add("type", new JsonPrimitive("LABEL_DETECTION"));
        JsonArray features = new JsonArray();
        features.add(feature);
        request.add("features", features);

        annotateImage(request.toString())
                .addOnCompleteListener(new OnCompleteListener<JsonElement>() {
                    @Override
                    public void onComplete(@NonNull Task<JsonElement> task) {
                        if (!task.isSuccessful()) {
                            Log.d("ImageLabelingFAILED",task.getException().toString());

                        } else {
                            for (JsonElement label : task.getResult().getAsJsonArray().get(0).getAsJsonObject().get("labelAnnotations").getAsJsonArray()) {
                                JsonObject labelObj = label.getAsJsonObject();
                                String text = labelObj.get("description").getAsString();
                                String entityId = labelObj.get("mid").getAsString();
                                float score = labelObj.get("score").getAsFloat();
                                Log.d("Label", text);
                            }
                        }
                    }
                });
    }

    private Task<JsonElement> annotateImage(String requestJson) {
        return mFunctions
                .getHttpsCallable("annotateImage")
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
