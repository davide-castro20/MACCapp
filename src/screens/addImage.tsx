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

import {lableImage} from '../mlkit';

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

    const {width} = useWindowDimensions();

    return (
        <View>
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

            <ScrollView>
            <Text>{JSON.stringify(response, null, 2)}</Text>
            </ScrollView>
            { response?.assets &&

                
                response?.assets.map(({uri}: {uri: string}) => (
                    <View key={uri}>
                    <Image
                        resizeMode="cover"
                        resizeMethod="scale"
                        style={{height: width}}
                        source={{uri: uri}}
                    />
                    </View>
                ))
            }
              

        </View>
    );
};

export default AddImageScreen;