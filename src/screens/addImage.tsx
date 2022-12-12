import {
    View,
    //Image,
    // Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    useWindowDimensions,
    Image,
    ImageBackground,
} from 'react-native';

import {
    Svg,
    Rect,
    ClipPath,
    Defs,
    Circle,
    Text
} from 'react-native-svg';

import { Button, Tile } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import { labelImage, detectFaces } from '../mlkit';

import * as ImagePicker from 'react-native-image-picker';
import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker/lib/typescript/types';

type Face = {
    id: number,
    top: number,
    left: number,
    width: number,
    height: number
}

const AddImageScreen = (prop: any) => {

    const [response, setResponse] = useState<any>(null);
    const [labelsReady, setLabelsReady] = useState(false);
    const [facesReady, setFacesReady] = useState(false);

    const [labels, setLabels] = useState<any>([]);
    const [faces, setFaces] = useState<any>([]);
    
    const [imageDimensions, setImageDimensions] = useState({});

    const [facesOffset, setFacesOffset] = useState(0);

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

            setLabelsReady(false);
            setFacesReady(false);
            setFacesOffset(0);
            
            identifyLabels(uri);
            identifyFaces(uri);
        }
    }, [response]);

    const identifyLabels = async (uri: string) => {
        if (uri) {
            try {
                //const labelsResponse = await labelImage(uri);
                setLabelsReady(true);
                //setLabels(labelsResponse);

                // for (let label of labelsResponse) {
                //     console.log("Label:");
                //     console.log(label);
                // }
            } catch (error) {
                console.log("Labeling error: " + error);
            }
        }
    }

    const identifyFaces = async (uri: string) => {

        if (uri) {
            try {
                let dimensions : any = {};
                const facesResponse = await detectFaces(uri);
                await Image.getSize(uri, (width, height) => {dimensions.width = width; dimensions.height = height;});

            
                let newFacesResponse : any = [];
                for (let face of facesResponse) {
                    face.width = Math.round((face.width / dimensions.width) * 100);
                    face.height = Math.round((face.height / dimensions.height) * 100);
                    face.left = Math.round((face.left / dimensions.width) * 100);
                    face.top = Math.round((face.top / dimensions.height) * 100);
                    newFacesResponse = [...newFacesResponse, face];
                }

                setImageDimensions(dimensions);

                setFacesReady(true);
                setFaces(newFacesResponse);

            } catch (error) {
                console.log("Face recognition error");
            }
        }
    };

    return (
        <View style={{height: "100%", marginHorizontal: "5%"}}>
            {/* <ScrollView>
            <Text>{JSON.stringify(response, null, 2)}</Text>
            </ScrollView> */}

            {!response?.assets ? (
                <View style={{ flex: 1, justifyContent: 'center'}}>
                
                <Button
                    size="lg"
                    containerStyle={{paddingHorizontal: "15%"}}
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
                </View>
            ) : (
                <View style={{height: "100%"}}>
                    {(labelsReady && facesReady) ?
                        (
                            <View key={"selected_image"} style={{flex: 1, justifyContent:'flex-start'}}>

                                <ImageBackground
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="contain"
                                    resizeMethod='resize'
                                    source={{ uri: response.assets[0].uri }}
                                    onLayout={(event) => {
                                        const { width, height } = event.nativeEvent.layout;
                                        let ratioOriginal = imageDimensions.width / imageDimensions.height;
                                        let ratioContainer = width / height;

                                        if (ratioOriginal > ratioContainer) {
                                            let newFacesOffset = Math.round((1 - (ratioContainer/ratioOriginal))*100);
                                            setFacesOffset(newFacesOffset);
                                        }
                                        
                                    }} 
                                >
                                <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
                                {
                                    faces.map((face: Face) => (
                                        <Rect 
                                            x={face.left + "%"}
                                            y={((face.top * (1-(facesOffset/100))) + Math.round(facesOffset/2)) + "%"} 
                                            width={face.width + "%"} 
                                            height={(face.height * (1-(facesOffset/100))) + "%"} 
                                            stroke="white" 
                                            key={face.id} 
                                            id={"face" + face.id} 
                                            strokeWidth="3"
                                            strokeOpacity={0.7}
                                            onPress={() => {
                                            }}/>
                                    ))
                                }
                                </Svg>
                                </ImageBackground>
                            </View>

                        ) :
                        (
                            <View key={"loading image"} style={{flex: 1, justifyContent:'center'}}>
                                <ActivityIndicator size="large" />
                            </View>
                        )
                    }
                    <Button
                        type="solid"
                        title="Select another image"
                        containerStyle={{ marginBottom: 20 }}
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