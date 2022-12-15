import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { Button, Text, Input } from '@rneui/themed';

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import createPostStyles from '../../src/styles/createPost';

import Geolocation from '@react-native-community/geolocation';

import { getLocationName } from '../location';


const CreatePostScreen = (props: any) => {

    const [postText, setPostText] = useState("");
    const [postTags, setPostTags] = useState("");
    const [creatingPost, setCreatingPost] = useState(false);

    const styles = createPostStyles(props);

    const createPost = () => {
        if (!auth().currentUser) return;

        Geolocation.getCurrentPosition(async info => {
            
            console.log(info)

            let location = await getLocationName(info.coords.latitude, info.coords.longitude);
            location = JSON.parse(location);
        
            setCreatingPost(true);

            let post = {
                creator: auth().currentUser?.uid,
                text: postText,
                tags: postTags.split(" "),
                creation_date: firestore.FieldValue.serverTimestamp(),
                location: location['formatted_address'],
            };

            console.log(post);

            firestore()
                .collection('posts')
                .add(post)
                .then(() => {
                    console.log('Post added!');
                    setCreatingPost(false);
                });
        });
    };

    return (
        <View style={styles.backgroundPage}>
            <View style={styles.inputView}>
                <Input
                    style={styles.textInput}
                    placeholder="What are you thinking?..."
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setPostText(text)}
                    multiline={true}
                />
            </View>
            <View style={styles.inputView}>
                <Input
                    style={styles.textInput}
                    placeholder="Tags..."
                    placeholderTextColor="#003f5c"
                    onChangeText={tags => setPostTags(tags)}
                />
            </View>

            <View>
                <Button type="solid" disabled={creatingPost} title="Add Image" onPress={() => {props.navigation.push("AddImage")}} />

                <Button type="solid" disabled={creatingPost} title="Create Post" onPress={createPost} />
            </View>

            { creatingPost &&
                <ActivityIndicator />
            }
        </View>
    );
};

export default CreatePostScreen;