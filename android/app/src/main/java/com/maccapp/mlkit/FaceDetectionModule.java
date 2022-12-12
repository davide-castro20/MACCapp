package com.maccapp.mlkit;

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
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.functions.FirebaseFunctions;
import com.google.firebase.functions.HttpsCallableResult;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.Face;
import com.google.mlkit.vision.face.FaceDetection;
import com.google.mlkit.vision.face.FaceDetector;
import com.google.mlkit.vision.face.FaceDetectorOptions;
import com.google.mlkit.vision.face.FaceLandmark;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class FaceDetectionModule extends ReactContextBaseJavaModule {

    private FirebaseFunctions mFunctions;

    public FaceDetectionModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "FaceDetectionModule";
    }

    @ReactMethod
    public void detectFaces(String uriString, Promise promise) {
        Log.d("FaceDetection", "Uri: " + uriString);

        Uri uri = Uri.parse(uriString);

        // Real-time contour detection
        FaceDetectorOptions realTimeOpts =
                new FaceDetectorOptions.Builder()
                        .enableTracking() // assign faces an ID, which can be used to track faces across images
                        .build();

        InputImage image;
        try {
            image = InputImage.fromFilePath(getReactApplicationContext(), uri);
        } catch (IOException e) {
            e.printStackTrace();
            Log.d("FaceDetectionError", "Image from uri");
            return;
        }

        FaceDetector detector = FaceDetection.getClient(realTimeOpts);

        Task<List<Face>> result =
                detector.process(image)
                        .addOnSuccessListener(
                                (OnSuccessListener<List<Face>>) faces -> {
                                    WritableArray facesArray = Arguments.createArray();
                                    for (Face face : faces) {
                                        Rect bounds = face.getBoundingBox();
                                        float rotY = face.getHeadEulerAngleY();  // Head is rotated to the right rotY degrees
                                        float rotZ = face.getHeadEulerAngleZ();  // Head is tilted sideways rotZ degrees
                                        int id = face.getTrackingId();

                                        Log.d("Face", bounds.toString());

                                        WritableMap faceObject = Arguments.createMap();
                                        faceObject.putInt("id", id);
                                        faceObject.putInt("top", bounds.top);
                                        faceObject.putInt("left", bounds.left);
                                        faceObject.putInt("centerX", bounds.centerX());
                                        faceObject.putInt("centerY", bounds.centerY());
                                        faceObject.putInt("width", bounds.width());
                                        faceObject.putInt("height", bounds.height());


                                        facesArray.pushMap(faceObject);
                                    }
                                    promise.resolve(facesArray);
                                })
                        .addOnFailureListener(
                                new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull Exception e) {
                                        // Task failed with an exception
                                        // ...
                                        promise.reject("Face recognition error", "No response");
                                    }
                                });
    }

}

