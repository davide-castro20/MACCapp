import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    SafeAreaView,
} from 'react-native';

import { Button, Text, Input, Dialog, Image, Divider, useTheme } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import createPostStyles from '../../src/styles/createPost';

import Geolocation from '@react-native-community/geolocation';

import { getLocationName } from '../location';

import Toast from 'react-native-toast-message';
import newPost from '../redux/newPost';

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

    const image = useSelector((state: any) => state.newPost.image);
    const labels = useSelector((state: any) => state.newPost.labels);
    const faces = useSelector((state: any) => state.newPost.faces);

    const styles = createPostStyles(props);
    
    const dispatch = useDispatch();

    const theme = useTheme();

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

            console.log(info)

            // let location = await getLocationName(info.coords.latitude, info.coords.longitude);
            // location = location ? JSON.parse(location) : null;


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
                tags: postTags.split(" "),
                creation_date: firestore.FieldValue.serverTimestamp(),
                image: imageReference ? imageReference.fullPath : null,
                // location: location ? location['formatted_address'] : null,
            };

            console.log(post);

            firestore()
                .collection('posts')
                .add(post)
                .then(() => {
                    console.log('Post added!');
                    dispatch(resetNewPost());
                    setCreatingPost(false);

                    Toast.show({
                        type: 'success',
                        text1: 'Post created successfuly',
                    });
                    props.navigation.goBack();
                });
        },
        error => {
            console.log(error);

            Toast.show({
                type: 'error',
                text1: 'Error creating post',
                text2: 'Please try again later',
            });
            
            
            setCreatingPost(false);
        },
        {
            maximumAge: 0,
            timeout: 20000,
            enableHighAccuracy: true,
        });
    };

    return (
        <View style={styles.backgroundPage}>
            <Dialog
                isVisible={creatingPost}
                overlayStyle={styles.loadingDialogContainer}
            >
                <Dialog.Loading loadingStyle={styles.loadingLoadingStyle} />
            </Dialog>
            
            <View style={styles.inputGroup}>
                <View style={styles.inputView}>
                    <Input
                        style={styles.textInput}
                        placeholder="What are you thinking?..."
                        placeholderTextColor="#003f5c"
                        onChangeText={text => setPostText(text)}
                        disabled={creatingPost}
                        numberOfLines={1}
                        multiline={true}
                    />
                </View>
                <View style={styles.inputView}>
                    <Input
                        style={styles.textInput}
                        placeholder="Add tag..."
                        placeholderTextColor="#003f5c"
                        disabled={creatingPost}
                        onChangeText={tags => setPostTags(tags)}
                    />
                </View>
            </View>

            <Divider width={2} color={theme.theme.colors.grey3}/>

            {
                image &&
                <>
                <View style={styles.imagePreviewBackground}>
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            style={styles.imagePreview}
                            source={{uri: image}}
                            resizeMode={'contain'}
                            />
                    </View>
                </View>

                <Divider width={2} color={theme.theme.colors.grey3}/>
                </>
            }

            <View>
                {   !image ? (
                    <Button type="solid" disabled={creatingPost} title="Add Image" onPress={() => { props.navigation.push("AddImage") }} />

                ) : (
                    <Button type="outline" disabled={creatingPost} title="Change Image" onPress={() => { props.navigation.push("AddImage") }} />
                )
                }
                <Button type="solid" disabled={creatingPost} title="Create Post" onPress={createPost} />
            </View>
        </View>
    );
};

export default CreatePostScreen;