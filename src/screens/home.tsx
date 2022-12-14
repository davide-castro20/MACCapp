import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Dimensions
} from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon, FAB, useTheme, Skeleton } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


import styles from '../../src/styles/style';

import PostItem from '../components/PostItem';

import {useDispatch, useSelector} from 'react-redux'


const HomeScreen = (props: any) => {


    const [loadingPosts, setLoadingPosts] = useState(false);
    const [posts, setPosts] = useState([]);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    const theme = useTheme();

    const storeState = useSelector(state => state);
    const user = useSelector(state => state.user.user);
    const userData = useSelector(state => state.user.userData);

    const screenDimensions = Dimensions.get('screen');

    useEffect(() => {
        getPosts(user);
    }, []);

    const refreshPosts = useCallback(() => {
        getPosts(user);
    }, []);

    async function getPosts(user: any) {
        if (!user) return;

        setLoadingPosts(true);


        return firestore()
            .collection('posts')
            .where('creator', '==', user.uid)
            .onSnapshot(postsSnapshot => {
                let newPosts: any = [];
                let postPromises: Promise<void | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>[] = [];

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

    const keyExtractor = (_item: any, index: number) => index.toString();

    const HomeSpeedDial = () => {
        return (
            <SpeedDial
                isOpen={speedDialOpen}
                color={"#000"}
                icon={<Icon reverse
                    size={20}
                    color={"#000"}
                    iconStyle={{ color: "#fff" }}
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
        );
    }

    if (loadingPosts || !userData)
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                keyExtractor={keyExtractor}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                renderItem={(item) => {
                    return (
                        <ListItem bottomDivider>
                            <ListItem.Title><Skeleton
                                circle={true}
                                animation="pulse"
                                width={35}
                            /></ListItem.Title>
                            <ListItem.Content>
                                <ListItem.Title style={{ marginBottom: 5 }}>
                                    <Skeleton
                                        animation="pulse"
                                        width={(Math.random() * screenDimensions.width * 0.3) + (screenDimensions.width * 0.2)}
                                        height={15}
                                    />
                                </ListItem.Title>
                                <ListItem.Subtitle>
                                    <Skeleton
                                        animation="pulse"
                                        width={300}
                                        height={23}
                                    />
                                </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>);
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingPosts}
                        onRefresh={refreshPosts}
                        title="Pull to refresh" />
                }
            />
            </View>
        );

    return (
        <View style={{ flex: 1 }}>

            <FlatList
                keyExtractor={keyExtractor}
                data={posts}
                renderItem={(postItem) => { return <PostItem post={postItem.item} /> }}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingPosts}
                        onRefresh={refreshPosts}
                        title="Pull to refresh" />
                }
            />
            <HomeSpeedDial />

        </View>
    );
}

export default HomeScreen;