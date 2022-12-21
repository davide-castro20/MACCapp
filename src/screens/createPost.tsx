import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    SafeAreaView,
    useWindowDimensions,
    Pressable,
} from 'react-native';

import { Button, Text, Input, Dialog, Image, Divider, useTheme, Chip } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import createPostStyles from '../../src/styles/createPost';

import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

import { getLocationName } from '../location';

import Toast from 'react-native-toast-message';
import newPost, { setNewLabels, removeLabel } from '../redux/newPost';

import { useDispatch, useSelector } from 'react-redux';

import { resetNewPost } from '../redux/newPost';

import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const CreatePostScreen = (props: any) => {

    const [postText, setPostText] = useState("");
    const [postTags, setPostTags] = useState("");
    const [creatingPost, setCreatingPost] = useState(false);

    const [newTag, setNewTag] = useState("");
    const [imagePreviewHeight, setImagePreviewHeight] = useState(0);

    const image = useSelector((state: any) => state.newPost.image);
    const labels = useSelector((state: any) => state.newPost.labels);
    const faces = useSelector((state: any) => state.newPost.faces);
    const imagePreview = useSelector((state: any) => state.newPost.imagePreview);


    const styles = createPostStyles(props);

    const dispatch = useDispatch();

    const theme = useTheme();

    const addTag = () => {
        if (labels == null || !labels.includes(newTag)) {
            dispatch(setNewLabels([newTag]));
        }
        setNewTag("");
    }

    const imagePreviewLayout = useCallback((event: any) => {

        const containerWidth = event.nativeEvent.layout.width;

        let aspectRatio = imagePreview;


        setImagePreviewHeight(containerWidth / aspectRatio);
    }, [image]);

    const createPost = () => {
        if (!auth().currentUser) return;

        setCreatingPost(true);

        if (!image && postText == "") {

            Toast.show({
                type: 'error',
                text1: 'Error creating post',
                text2: 'You must add text or an image!',
            });

            setCreatingPost(false);
            return;
        }


        Geolocation.getCurrentPosition(async info => {
            publishPost(info);
        },
        error => {
            console.log(error);
    
            // Toast.show({
            //     type: 'error',
            //     text1: 'Error creating post',
            //     text2: 'Please try again later',
            // });

            publishPost(null);
    
    
            // setCreatingPost(false);
        },
        {
            maximumAge: 0,
            timeout: 20000,
            enableHighAccuracy: false,
        });
            
    };

    const publishPost = async (locationInfo: null | GeolocationResponse) => {
        console.log(locationInfo)

        let location = null;
        
        if (locationInfo != null) {
            // location = await getLocationName(locationInfo.coords.latitude, locationInfo.coords.longitude);
            // location = location ? JSON.parse(location) : null;
        }

        let imageReference = null;

        if (image) {
            let imageUUID = uuidv4();
            imageReference = storage().ref(`post_images/${imageUUID}.png`);
            const pathToFile = image;

            await imageReference.putFile(pathToFile);
        }

        let post = {
            creator: auth().currentUser?.uid,
            text: postText,
            textWords: postText.split(' '),
            tags: labels,
            faces: faces,
            creation_date: firestore.FieldValue.serverTimestamp(),
            image: imageReference ? imageReference.fullPath : null,
            // location: location ? location['formatted_address'] : null,
        };

        console.log(post);

        firestore()
            .collection('posts')
            .add(post)
            .finally(() => {
                console.log('Post added!');
                dispatch(resetNewPost());
                setCreatingPost(false);

                Toast.show({
                    type: 'success',
                    text1: 'Post created successfuly',
                    text2: 'Posted without location'
                });
                props.navigation.goBack();
            });
    
    }

    return (
        <ScrollView contentContainerStyle={styles.backgroundPage}>
            <Dialog
                isVisible={creatingPost}
                overlayStyle={styles.loadingDialogContainer}
            >
                <Dialog.Loading loadingStyle={styles.loadingLoadingStyle} />
            </Dialog>

            <View style={styles.inputGroup}>
                <View style={styles.inputViewPost}>
                    <Input
                        style={styles.textInput}
                        containerStyle={styles.textInputContainer}
                        placeholder="What are you thinking?..."
                        placeholderTextColor="#003f5c"
                        onChangeText={text => setPostText(text)}
                        disabled={creatingPost}
                        numberOfLines={1}
                        multiline={true}
                    />
                </View>
                <View style={styles.inputViewTags}>
                    <Input
                        style={styles.textInput}
                        containerStyle={styles.tagsInputContainer}
                        placeholder="Add tag..."
                        placeholderTextColor="#003f5c"
                        disabled={creatingPost}
                        value={newTag}
                        onChangeText={textTag => setNewTag(textTag)}
                        onSubmitEditing={() => { addTag() }}
                    />
                </View>

                {labels &&
                    <View style={styles.tagsView}>
                        {
                            labels?.map((label: string) => {
                                return (
                                    <Chip
                                        title={label}
                                        size='sm'
                                        containerStyle={{ alignSelf: 'flex-start', marginHorizontal: 3, marginTop: 5 }}
                                        icon={{
                                            name: 'times',
                                            type: 'font-awesome-5',
                                            size: 15,
                                            onPress: () => {
                                                dispatch(removeLabel(label));
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                    </View>
                }

            </View>

            {
                image ?
                    (
                        <>
                            <Divider width={1} color={"#003f5c"} style={{ marginBottom: 0, marginTop: 20 }} />
                            <View style={{ ...styles.imagePreviewBackground, height: imagePreviewHeight }} onLayout={imagePreviewLayout}>
                                <View style={styles.imagePreviewContainer}>
                                    <Image
                                        style={styles.imagePreview}
                                        source={{ uri: image }}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </View>

                        </>
                    ) : (
                        <View style={styles.imageInput}>
                            <Pressable
                                style={styles.imageButton}
                                disabled={creatingPost}
                                onPress={() => { props.navigation.push("AddImage") }}
                            >
                                <Text style={{ textAlign: 'center' }}>Add Image</Text>
                            </Pressable>
                        </View>
                    )
            }

            <View style={styles.buttonsView}>
                {image &&
                    <Button
                        type="outline"
                        style={styles.changeImage}
                        disabled={creatingPost}
                        title="Change Image"
                        onPress={() => { props.navigation.push("AddImage") }}
                    />
                }
                <Button
                    type="solid"
                    containerStyle={styles.createButton}
                    disabled={creatingPost}
                    title="Create Post"
                    onPress={createPost} />
            </View>
        </ScrollView>
    );
};

export default CreatePostScreen;