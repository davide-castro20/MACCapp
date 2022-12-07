import {
    View,
    Image,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    useWindowDimensions,
} from 'react-native';

import {
    Surface,
    Shape,
    Group,
    ClippingRectangle,
  } from '@react-native-community/art';

import { Button } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import { labelImage, detectFaces } from '../mlkit';

import * as ImagePicker from 'react-native-image-picker';
import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker/lib/typescript/types';

const AddImageScreen = (prop: any) => {

    const [response, setResponse] = useState<any>(null);

    const pickImageButton = useCallback((type: string, options: ImageLibraryOptions | CameraOptions) => {
        if (type == "library") {
            ImagePicker.launchImageLibrary(options, setResponse);
        } else if (type == "capture") {
            ImagePicker.launchCamera(options, setResponse);
        }

    }, []);

    useEffect(() => {
        if (response?.assets) {
            let uri = response.assets[0].uri;
            labelImage(uri);
            identifyFaces(uri);
        }
    }, [response]);

    const identifyFaces = async (uri: string) => {

        if (uri) {
            try {
                const facesResponse = await detectFaces(uri);
                for (let face of facesResponse) {
                    console.log("Face:");
                    console.log(face);
                }
            } catch (error) {
                console.log("Face recognition error");
            }
        }
    };

    const { width } = useWindowDimensions();

    return (
        <View>
            {/* <ScrollView>
            <Text>{JSON.stringify(response, null, 2)}</Text>
            </ScrollView> */}

            {!response?.assets ? (
                <Button
                    type="solid"
                    title="Select image"
                    onPress={
                        () =>
                            pickImageButton('library', {
                                selectionLimit: 1,
                                mediaType: 'photo',
                                includeBase64: false,
                            })
                    }>
                </Button>
            ) : (
                <View>
                    <View key={"selected_image"}>
                        <Image
                            resizeMode="cover"
                            resizeMethod="scale"
                            style={{ height: width }}
                            source={{ uri: response?.assets[0].uri }}
                        />
                    </View>
                    <Button
                        type="solid"
                        title="Select another image"
                        onPress={
                            () =>
                                pickImageButton('library', {
                                    selectionLimit: 1,
                                    mediaType: 'photo',
                                    includeBase64: false,
                                })
                        }>
                    </Button>
                </View>
            )
            }


        </View>
    );
};

export default AddImageScreen;