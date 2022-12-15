import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { Button, Text, Input, Dialog } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import createPostStyles from '../../src/styles/createPost';

import Geolocation from '@react-native-community/geolocation';

import { getLocationName } from '../location';

import Toast from 'react-native-toast-message';


const CreatePostScreen = (props: any) => {

    const [postText, setPostText] = useState("");
    const [postTags, setPostTags] = useState("");
    const [creatingPost, setCreatingPost] = useState(false);

    const styles = createPostStyles(props);

    const createPost = () => {
        if (!auth().currentUser) return;

        setCreatingPost(true);


        Geolocation.getCurrentPosition(async info => {
            
            console.log(info)

            //let location = await getLocationName(info.coords.latitude, info.coords.longitude);
            //location = location ? JSON.parse(location) : null;

            let post = {
                creator: auth().currentUser?.uid,
                text: postText,
                tags: postTags.split(" "),
                creation_date: firestore.FieldValue.serverTimestamp(),
                //location: location ? location['formatted_address'] : null,
            };

            console.log(post);

            firestore()
                .collection('posts')
                .add(post)
                .then(() => {
                    console.log('Post added!');
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

        });
    };

    return (
        <View style={styles.backgroundPage}> 
            {/* {
                creatingPost &&
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator/>
                </View>
            }       */}

            <Dialog 
                isVisible={creatingPost}
                overlayStyle={styles.loadingDialogContainer} 
                backdropStyle={styles.loadingDialog}>
                <Dialog.Loading loadingStyle={styles.loadingLoadingStyle}/>
            </Dialog>
            <View style={styles.inputView}>
                <Input
                    style={styles.textInput}
                    placeholder="What are you thinking?..."
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setPostText(text)}
                    disabled={creatingPost}
                    multiline={true}
                />
            </View>
            <View style={styles.inputView}>
                <Input
                    style={styles.textInput}
                    placeholder="Tags..."
                    placeholderTextColor="#003f5c"
                    disabled={creatingPost}
                    onChangeText={tags => setPostTags(tags)}
                />
            </View>

            <View>
                <Button type="solid" disabled={creatingPost} title="Add Image" onPress={() => {props.navigation.push("AddImage")}} />

                <Button type="solid" disabled={creatingPost} title="Create Post" onPress={createPost} />
            </View>
        </View>
    );
};

export default CreatePostScreen;