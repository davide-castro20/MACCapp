import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import styles from '../../src/styles/style';

const HomeScreen = (props) => {


    const [loadingPosts, setLoadingPosts] = useState(false);
    const [posts, setPosts] = useState([]);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    useEffect(() => {
        getPosts(props.user);
    }, []);

    const refreshPosts = useCallback(() => {
        getPosts(props.user);
    }, []);

    async function getPosts(user: any) {
        if (!user) return;

        setLoadingPosts(true);


        return firestore()
            .collection('posts')
            .where('creator', '==', user.uid)
            .onSnapshot(postsSnapshot => {
                let newPosts = [];
                let postPromises = [];

                postsSnapshot.forEach(postSnap => {
                    let postData = postSnap.data();
                    postPromises.push(
                        firestore()
                            .collection('users')
                            .doc(postData.creator)
                            .get()
                            .then(postCreator => {
                                postData.creator = postCreator.data();
                                newPosts = [...newPosts, postData];
                            }));
                });

                Promise.all(postPromises).then(() => {
                    setPosts(newPosts);
                    setLoadingPosts(false);
                })
            });
    }

    const keyExtractor = (item, index) => index.toString();

    const renderPost = (post) => {
        let photo = post.item.creator.photoURL == null ? "" : post.item.creator.photoURL;
        return (
            <ListItem bottomDivider >
                <Avatar source={{ uri: photo }} rounded={true} />
                <ListItem.Content>
                    <ListItem.Title>{post.item.text}</ListItem.Title>
                    <ListItem.Subtitle>{post.item.creator.firstName} {post.item.creator.lastName}</ListItem.Subtitle>
                </ListItem.Content>
                {/* <ListItem.Chevron /> */}
            </ListItem>
        );
    }

    return (

        <View style={{flex: 1}}>
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
                                refreshing={loadingPosts}
                                onRefresh={refreshPosts}
                                title="Pull to refresh" />
                        }
                    />
                )
                // </ScrollView>
            }
            <SpeedDial
                isOpen={speedDialOpen}
                color={"#000"}
                icon={<Icon reverse
                    size={20}
                    color={"#000"}
                    iconStyle={{color: "#fff"}}
                    name='pen-nib'
                    type='font-awesome-5' 
                    />}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setSpeedDialOpen(!speedDialOpen)}
                onClose={() => setSpeedDialOpen(!speedDialOpen)}
            >
                <SpeedDial.Action
                    color={"#000"}      
                    icon={{ name: 'add', color: '#fff' }}
                    title="Add"
                    onPress={() => props.navigation.push("CreatePost")}
                />
                <SpeedDial.Action
                    color={"#000"}
                    icon={{ name: 'delete', color: '#fff' }}
                    title="Delete"
                    onPress={() => console.log('Delete Something')}
                />
            </SpeedDial>
        </View>

    );
}

export default HomeScreen;