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
    Text,

} from 'react-native-svg';

import { Button, Tile, Tooltip, TooltipProps, Input, Icon } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import { labelImage, detectFaces } from '../mlkit';

import * as ImagePicker from 'react-native-image-picker';
import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker/lib/typescript/types';
import { color } from '@rneui/base';

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { Face } from '../types';

import { useDispatch, useSelector } from 'react-redux';
import { setNewImage, setNewLabels, setNewFaces, setImagePreview } from '../redux/newPost';

type ImageDimensions = {
    width: number,
    height: number,
}

type FacesOffset = {
    vertical: number,
    horizontal: number,
}

const AddImageScreen = (props: any) => {

    const [response, setResponse] = useState<any>(null);
    const [labelsReady, setLabelsReady] = useState(false);
    const [facesReady, setFacesReady] = useState(false);

    const [labels, setLabels] = useState<any>([]);
    const [faces, setFaces] = useState<Map<number, Face>>(new Map());

    const [activeFace, setAtiveFace] = useState(-1);
    const [nameInput, setNameInput] = useState<string>("");
    const [inputUserId, setInputUserId] = useState<string>("");
    const [usernameChecked, setUsernameChecked] = useState(false);

    const [imageDimensions, setImageDimensions] = useState<ImageDimensions>();

    const [facesOffset, setFacesOffset] = useState({ vertical: 0, horizontal: 0 });
    
    const dispatch = useDispatch();

    const wtf = useSelector((state: any) => state.newPost.faces);


    const pickImageButton = useCallback((type: string, options: ImageLibraryOptions | CameraOptions) => {
        if (type == "library") {
            ImagePicker.launchImageLibrary(options, setResponse);
        } else if (type == "capture") {
            ImagePicker.launchCamera(options, setResponse);
        }
    }, []);

    const submitNewImage = () => {
        dispatch(setNewImage(response.assets[0].uri));
        dispatch(setImagePreview(imageDimensions?.width/imageDimensions?.height));
        dispatch(setNewLabels(labels));
        dispatch(setNewFaces(Array.from(faces.values())));
        props.navigation.goBack();
    };

    useEffect(() => {
        if (response?.assets) {
            let uri = response.assets[0].uri;

            setLabelsReady(false);
            setFacesReady(false);
            setAtiveFace(-1);
            setFacesOffset({ vertical: 0, horizontal: 0 });

            identifyLabels(uri);
            identifyFaces(uri);
        }
    }, [response]);

    const checkUser = (username : string) => {

        setUsernameChecked(false);
        setInputUserId("");
        return firestore()
        .collection('users')
        .where('username', '==', username)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.size > 0) {

                setInputUserId(querySnapshot.docs[0].id);
            } 
            setUsernameChecked(true);
        });
    };

    useEffect(() => {
        if (faces.has(activeFace))
            if (faces.get(activeFace)?.user.username != null) {
                checkUser(faces.get(activeFace).user.username);
            }
    }, [activeFace]);

    const identifyLabels = async (uri: string) => {
        if (uri) {
            try {
                // const labelsResponse = await labelImage(uri);
                setLabelsReady(true);

                // let newLabels : string[] = [];

                // for (let label of labelsResponse) {
                //     console.log("Label:");
                //     console.log(label);
                //     newLabels = [...newLabels, label.text];
                // }

                // setLabels(newLabels);

            } catch (error) {
                console.log("Labeling error: " + error);
            }
        }
    }

    const identifyFaces = async (uri: string) => {

        if (uri) {
            try {
                let dimensions: any = {};
                const facesResponse = await detectFaces(uri);
                await Image.getSize(uri, (width, height) => { dimensions.width = width; dimensions.height = height; });

                let facesMap = new Map();

                for (let face of facesResponse) {
                    face.width = Math.round((face.width / dimensions.width) * 100);
                    face.height = Math.round((face.height / dimensions.height) * 100);
                    face.left = Math.round((face.left / dimensions.width) * 100);
                    face.top = Math.round((face.top / dimensions.height) * 100);
                    face.centerX = Math.round((face.centerX / dimensions.width) * 100);
                    face.centerY = Math.round((face.centerY / dimensions.height) * 100);
                    face.user = {};

                    facesMap.set(face.id, face);
                }

                setImageDimensions(dimensions);

                console.log(facesMap)

                setFacesReady(true);
                setFaces(facesMap);

            } catch (error) {
                console.log("Face recognition error");
            }
        }
    };

    const FaceTooltip: React.FC<TooltipProps> = (props) => {
        const [open, setOpen] = React.useState(false);
        return (
            <Tooltip
                visible={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                {...props}
            />
        );
    };

    return (
        <View style={{ height: "100%", marginHorizontal: "5%" }}>
            {/* <ScrollView>
            <Text>{JSON.stringify(response, null, 2)}</Text>
            </ScrollView> */}

            {!response?.assets ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>

                    <Button
                        size="lg"
                        containerStyle={{ paddingHorizontal: "15%" }}
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
                <View style={{ height: "100%" }}>
                    {(imageDimensions && labelsReady && facesReady) ?
                        (
                            <View key={"selected_image"} style={{ flex: 1, justifyContent: 'flex-start' }}>

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
                                            let newFacesOffsetVertical = Math.round((1 - (ratioContainer / ratioOriginal)) * 100);
                                            setFacesOffset({ vertical: newFacesOffsetVertical, horizontal: 0 });

                                        } else if (ratioOriginal < ratioContainer) {
                                            let newFacesOffsetHorizontal = Math.round((1 - (ratioOriginal / ratioContainer)) * 100); 1
                                            setFacesOffset({ vertical: 0, horizontal: newFacesOffsetHorizontal });
                                        }

                                    }}
                                >
                                    <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
                                        {

                                            Array.from(faces.values()).map((face: Face) => (
                                                <View>
                                                    <Rect
                                                        x={((face.left * (1 - (facesOffset.horizontal / 100))) + Math.round(facesOffset.horizontal / 2)) + "%"}
                                                        y={((face.top * (1 - (facesOffset.vertical / 100))) + Math.round(facesOffset.vertical / 2)) + "%"}
                                                        width={(face.width * (1 - (facesOffset.horizontal / 100))) + "%"}
                                                        height={(face.height * (1 - (facesOffset.vertical / 100))) + "%"}
                                                        stroke={activeFace == face.id ? "#94f277" : "white"}
                                                        key={face.id}
                                                        id={"face " + face.id}
                                                        strokeWidth="3"
                                                        strokeOpacity={0.7}
                                                        onPress={() => {
                                                            if (activeFace == face.id) {
                                                                setNameInput("");
                                                                setAtiveFace(-1)
                                                                return;
                                                            }
                                                            setAtiveFace(face.id)
                                                            setNameInput(face.user.username ? face.user.username : "")
                                                        }} />
                                                    {
                                                        activeFace == face.id &&
                                                        <Text
                                                            x={((face.centerX * (1 - (facesOffset.horizontal / 100))) + Math.round(facesOffset.horizontal / 2)) + "%"}
                                                            y={(((face.top * (1 - (facesOffset.vertical / 100))) + Math.round(facesOffset.vertical / 2)) - 1) + "%"}
                                                            stroke="#000" fill="#000" textAnchor="middle" strokeWidth={1.5}
                                                            opacity={0.4}
                                                            fontSize={20}
                                                        >{face.user.username}</Text>
                                                    }
                                                </View>

                                            ))
                                        }

                                    </Svg>

                                </ImageBackground>
                            </View>

                        ) :
                        (
                            <View key={"loading image"} style={{ flex: 1, justifyContent: 'center' }}>
                                <ActivityIndicator size="large" />
                            </View>
                        )
                    }
                    {
                        activeFace != -1 &&
                        <Input
                            placeholder='Username...'
                            value={nameInput}
                            inputStyle={{ color: "#000" }}
                            onChangeText={value => {
                                setNameInput(value); 
                                checkUser(value);
                            }}
                            onSubmitEditing={event => {
                                if (usernameChecked && inputUserId.length > 0 && faces.has(activeFace)) {
                                    faces.get(activeFace).user = {
                                        username: event.nativeEvent.text,
                                        id: inputUserId,
                                        
                                    }
                                    faces.get(activeFace).user.username = event.nativeEvent.text;
                                } else {
                                    if (faces.has(activeFace)) {
                                        let userAlreadySet = faces.get(activeFace).user;
                                        if (userAlreadySet) {
                                            setNameInput(userAlreadySet.username);
                                            setInputUserId(userAlreadySet.id);
                                        }
                                    }
                                }
                            }}


                        rightIcon={  
                            (nameInput?.length > 0 && 
                                (
                                    usernameChecked ? (
                                        inputUserId.length > 0 ? 
                                        <Icon
                                        size={20}
                                        color={"#000"}
                                        iconStyle={{ color: "#0f0" }}
                                        name='check'
                                        type='font-awesome-5'
                                    /> : 
                                    <Icon
                                        size={20}
                                        color={"#000"}
                                        iconStyle={{ color: "#f00" }}
                                        name='times'
                                        type='font-awesome-5'
                                    /> 
                                    )
                                    
                                    :
                                    <ActivityIndicator/>
                                )
                            )
                        }
                        />
                    }

                    <View style={{ marginTop: 10, marginBottom: 20}}>
                        <View style={{flexDirection: 'row'}}>
                        <Button
                            type="outline"
                            title="Select another image"
                            style={{width: "50%"}}
                            containerStyle={{ flex: 1, marginRight: 10}}
                            onPress={
                                () =>
                                    pickImageButton('library', {
                                        selectionLimit: 1,
                                        mediaType: 'photo',
                                        includeBase64: false,
                                    })
                            }>
                        </Button>  
                        <Button
                            type="solid"
                            title="Confirm"
                            disabled={!labelsReady || !facesReady || !response?.assets}
                            containerStyle={{flex: 1, marginLeft: 10}}
                            onPress={ submitNewImage }>
                        </Button> 
                        </View>
                    </View>
                </View>
            )
            }


        </View>
    );
};

export default AddImageScreen;