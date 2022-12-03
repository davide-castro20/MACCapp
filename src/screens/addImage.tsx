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

import { Button } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import { labelImage } from '../mlkit';

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
            labelImage(response.assets[0].uri);
        }
    }, [response]);

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
                    {
                        response?.assets.map(({ uri }: { uri: string }) => (
                            <View key={uri}>
                                <Image
                                    resizeMode="cover"
                                    resizeMethod="scale"
                                    style={{ height: width }}
                                    source={{ uri: uri }}
                                />
                            </View>
                        ))
                    }
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