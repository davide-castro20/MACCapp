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

import styles from '../../src/styles/style';


const CreatePostScreen = (props: any) => {

    const [postText, setPostText] = useState("");
    const [postTags, setPostTags] = useState("");
    const [creatingPost, setCreatingPost] = useState(false);

    const createPost = () => {
        if (!auth().currentUser) return;

        setCreatingPost(true);

        let post = {
            creator: auth().currentUser?.uid,
            text: postText,
            tags: postTags.split(" "),
            creation_date: firestore.FieldValue.serverTimestamp(),
        };

        console.log(post);

        firestore()
            .collection('posts')
            .add(post)
            .then(() => {
                console.log('Post added!');
                setCreatingPost(false);
            });
    };

    return (
        <View>
            <View style={styles.inputView}>
                <Input
                    style={styles.textInput}
                    placeholder="Text"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setPostText(text)}
                />
            </View>
            <View style={styles.inputView}>
                <Input
                    style={styles.textInput}
                    placeholder="Tags"
                    placeholderTextColor="#003f5c"
                    onChangeText={tags => setPostTags(tags)}
                />
            </View>
            {
                !creatingPost ? (

                    <View>
                        <Button type="solid" title="Add Image" onPress={() => {props.navigation.push("AddImage")}} />

                        <Button type="solid" title="Create Post" onPress={createPost} />
                    </View>

                ) :
                    <ActivityIndicator />
            }
        </View>
    );
};

export default CreatePostScreen;