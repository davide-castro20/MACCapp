import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { ListItem, Avatar } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import PostList from '../../src/components/PostList';

import styles from '../../src/styles/style';

const HomeScreen = (props) => {


    const [loadingPosts, setLoadingPosts] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts(props.user);
    }, []);

    const refreshPosts = useCallback(() => {
        getPosts(props.user);
    }, []);

    function getPosts(user: any) {
        if (!user) return;

        setLoadingPosts(true);

        return firestore()
            .collection('posts')
            .where('creator', '==', user.uid)
            .onSnapshot(postsSnapshot => {
                setPosts([]);
                postsSnapshot.forEach(postSnap => {
                    let postData = postSnap.data();
                    firestore()
                        .collection('users')
                        .doc(postData.creator)
                        .get()
                        .then(postCreator => {
                            console.log(postCreator.data());
                            postData.creator = postCreator.data();
                            setPosts([...posts, postData]);
                        });
                });
                console.log(posts);
                setLoadingPosts(false);
            });
    }

    const keyExtractor = (item, index) => index.toString();

    const renderPost = (post) => {
        let photo = post.item.creator.photoURL == null ? "" : post.item.creator.photoURL;
        console.log(photo)
        return (
            <ListItem bottomDivider >
                <Avatar source={{uri: photo}} rounded={true}/>
                <ListItem.Content>  
                    <ListItem.Title>{post.item.text}</ListItem.Title>
                    <ListItem.Subtitle>{post.item.creator.firstName} {post.item.creator.lastName}</ListItem.Subtitle>
                </ListItem.Content>
                {/* <ListItem.Chevron /> */}
            </ListItem>
        );
    }

    return (

        <View>
            {
                loadingPosts ? (
                    <ActivityIndicator />
                ) : (
                    // <ScrollView>
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={posts}
                        renderItem={renderPost}
                        refreshControl={
                            <RefreshControl
                                refreshing={ loadingPosts }
                                onRefresh={ refreshPosts }
                                title="Pull to refresh"/>
                        }
                    />
                )
                // </ScrollView>
            }
        </View>

    );
}

export default HomeScreen;