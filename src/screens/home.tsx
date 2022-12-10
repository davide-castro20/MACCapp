import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon, FAB, useTheme } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


import styles from '../../src/styles/style';

import PostItem from '../components/PostItem';



const HomeScreen = (props: any) => {


    const [loadingPosts, setLoadingPosts] = useState(false);
    const [posts, setPosts] = useState([]);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    const theme = useTheme();

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

    if (loadingPosts)
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems:'center', alignContent: 'center' }}>
                {/* <ActivityIndicator style={{ alignSelf: 'center' }} /> */}
                <FAB
                    loading
                    visible={true}
                    size='small'
                    icon={{ name:'loading', color: theme.theme.colors.white }}
                    style={{alignSelf:'center'}}
                    color={theme.theme.colors.black}
                />
                <HomeSpeedDial />
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