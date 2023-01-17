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
import storage from '@react-native-firebase/storage';

import styles from '../../src/styles/style';

import PostItem from '../components/PostItem';

import { useDispatch, useSelector } from 'react-redux';

import homeStyles from '../styles/home';

import { CommonActions } from '@react-navigation/native';


const HomeScreen = (props: any) => {


    const [loadingPosts, setLoadingPosts] = useState(false);
    const [posts, setPosts] = useState([]);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    const theme = useTheme();

    const storeState = useSelector(state => state);
    const user = useSelector((state: any) => state.user.user);
    const userData = useSelector((state: any) => state.user.userData);

    const screenDimensions = Dimensions.get('screen');

    const styles = homeStyles(props);

    useEffect(() => {
        getPosts(user, userData);
    }, [userData]);

    const refreshPosts =    () => {
        getPosts(user, userData);
    };

    async function getPosts(user: any, userData: any) {
        if (!user) return;

        setLoadingPosts(true);

        if (!userData) {
            return;
        }


        if (!userData.following || userData.following.length == 0) {
            setPosts([]);
            setLoadingPosts(false)
            return;
        }

        console.log(userData.following)

        return firestore()
            .collection('posts')
            // .where('creator', '==', user.uid)
            // .orderBy('creation_date', 'desc') // onsnapshot does not work with the orderby because the date is not immediately available
            .where('creator', 'in', userData.following)
            // .orderBy('creation_date', 'desc')
            .onSnapshot(postsSnapshot => {
                let newPosts: any = [];
                let postPromises: Promise<void | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>[] = [];

                postsSnapshot?.forEach(postSnap => {
                    let postData = postSnap.data();

                    
                    // In the case the post is just created, the date is not available yet in the first snapshot 
                    // because it is created by firebase serverside
                    if (postData.creation_date) {
                        postData.creation_date = postData.creation_date.toDate();
                    }


                    postPromises.push(
                        firestore()
                            .collection('users')
                            .doc(postData.creator)
                            .get()
                            .then(async postCreator => {

                                if (postData.image && postData.image != "") {
                                    const postImageUrl = await storage().ref(postData.image).getDownloadURL();
                                    postData.image = postImageUrl;
                                }

                                postData.creator = postCreator.data();
                                const profilePicUrl = await storage().ref(postData.creator.photoURL).getDownloadURL();
                                postData.creator.photoURL = profilePicUrl;
                                newPosts = [...newPosts, postData];
                            }));
                });

                Promise.all(postPromises).then(() => {

                    newPosts.sort(function(a, b) {
                        if (a.creation_date == null)
                            return -1;
                        else if (b.creation_date == null) 
                            return 1;
                        else
                            return new Date(b.creation_date) - new Date(a.creation_date);
                    });
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
                color={styles.speedDial.color}
                icon={<Icon
                    size={20}
                    color={styles.speedDial.color}
                    iconStyle={{ color: "#fff" }}
                    name='pen-nib'
                    type='font-awesome-5'
                />}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setSpeedDialOpen(!speedDialOpen)}
                onClose={() => setSpeedDialOpen(!speedDialOpen)}
            >
                <SpeedDial.Action
                    color={styles.speedDial.color}
                    icon={{ name: 'add', color: '#fff' }}
                    title="Add Post"
                    onPress={() => { setSpeedDialOpen(false); props.navigation.push("CreatePost"); }}
                />
                <SpeedDial.Action
                    color={styles.speedDial.color}
                    icon={{ name: 'image', color: '#fff' }}
                    title="Image"
                    onPress={() => {
                        setSpeedDialOpen(false);
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: 'Home' },
                                    { name: 'CreatePost' },
                                    {
                                        name: 'AddImage',
                                    },
                                ],
                            })
                        );
                    }}
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
        <View style={styles.backgroundPage}>

            <FlatList
                keyExtractor={keyExtractor}
                contentContainerStyle={{ flexGrow: 1 }}
                data={posts}
                renderItem={(postItem) => { return <PostItem post={postItem.item} /> }}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingPosts}
                        onRefresh={refreshPosts}
                        title="Pull to refresh" />
                }
                ListEmptyComponent={(
                    <View style={styles.emptyList}>
                        <Text style={styles.emptyListText}>It seems that your feed is empty...</Text>
                    </View>
                )}
            />

            <HomeSpeedDial />

        </View>
    );
}

export default HomeScreen;