import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
} from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon, Switch, useThemeMode, ThemeMode, Divider, useTheme, Button } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import PostItem from '../components/PostItem';


import styles from '../../src/styles/style';
import { useSelector, useDispatch } from 'react-redux';

import { enableDynamicMode, disableDynamicMode, resetDynamicMode } from '../redux/dynamicMode';

import createUserMenuStyles from '../styles/userMenu';

import { unsetUser } from '../redux/user';


const UserMenuScreen = (props: any) => {

    const { mode, setMode } = useThemeMode();

    const dynamicMode = useSelector(state => state.dynamicMode.enabled);

    const dispatch = useDispatch();

    const styles = createUserMenuStyles(props);

    const currentUser = useSelector((state: any) => state.user);

    const theme = useTheme();

    const [loadingPosts, setLoadingPosts] = useState(false);
    const [posts, setPosts] = useState([]);

    const userData = useSelector((state: any) => state.user.userData);


    const keyExtractor = (_item: any, index: number) => index.toString();

    useEffect(() => {
        getPosts(currentUser.user, userData);
    }, [userData]);

    const signout = () => {
        auth()
        .signOut()
        .then(() => {
            console.log("Sign out");
            dispatch(unsetUser());
            dispatch(resetDynamicMode);
            props.navigation.goBack();
        })
    }

    async function getPosts(user: any, userData: any) {
        if (!user) return;

        setLoadingPosts(true);

        if (!userData) {
            return;
        }

        return firestore()
            .collection('posts')
            .where('creator', '==', user.uid)
            // .orderBy('creation_date', 'desc') // onsnapshot does not work with the orderby because the date is not immediately available
            //.where('creator', 'in', userData.following)
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

                    newPosts.sort(function (a, b) {
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

    const headerContent = () => {
        return (
            <>
                <View style={styles.profileInfoView}>
                    <View style={styles.profileAvatarView}>
                        <Avatar
                            source={{ uri: currentUser.userData.photoURL }}
                            rounded={true}
                            size={100}
                            containerStyle={styles.avatarContainer} />
                    </View>
                    <View style={styles.sideInfoView}>
                        <Text style={styles.userFullName}>{currentUser.userData.firstName} {currentUser.userData.lastName}</Text>
                        <Text style={styles.username}>@{currentUser.userData.username}</Text>

                        <View style={styles.statsView}>
                            <View style={{ ...styles.singleStat, marginRight: 15 }}>
                                <Text style={styles.statNumber}>{currentUser.userData.followers.length}</Text>
                                <Text style={styles.statText}>Followers</Text>
                            </View>
                            <View style={styles.singleStat}>
                                <Text style={styles.statNumber}>{currentUser.userData.following.length}</Text>
                                <Text style={styles.statText}>Following</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Divider color={theme.theme.colors.grey4} width={1} />


                <Text style={styles.settingsTitle}>Settings</Text>

                <View style={styles.optionsView}>

                    <View style={styles.dynamicOption}>
                        <Text style={styles.optionText}>Dynamic Mode</Text>
                        <Switch
                            onValueChange={() => {
                                dynamicMode ? dispatch(disableDynamicMode()) : dispatch(enableDynamicMode());
                            }}
                            value={dynamicMode}
                        />
                    </View>

                    <Divider color={theme.theme.colors.grey4} width={1} />

                    <View style={styles.darkOption}>
                        <Text style={!dynamicMode ? styles.optionText : styles.optionTextDisabled}>Dark Mode</Text>
                        <Switch
                            onValueChange={() => {
                                let newMode: ThemeMode;

                                if (mode == 'light') {
                                    newMode = 'dark';
                                }
                                else {
                                    newMode = 'light';
                                }

                                setMode(newMode);

                            }}
                            value={mode == 'dark'}
                            disabled={dynamicMode}
                        />
                    </View>

                    <Divider color={theme.theme.colors.grey4} width={1} />

                    <View style={styles.signoutOption}>
                        <Button
                            color={theme.theme.colors.error}
                            type='outline'
                            buttonStyle={{borderColor: theme.theme.colors.error}}
                            titleStyle={{color: theme.theme.colors.error}}
                            onPress={() => signout()}
                        >
                        Sign out    
                        </Button>
                    </View>
                </View>
                <Divider color={theme.theme.colors.grey4} width={3} />
            </>
        )
    }

    return (

        <View style={styles.page}>
            {
                !loadingPosts ?
                    (
                        <FlatList
                            keyExtractor={keyExtractor}
                            contentContainerStyle={{ flexGrow: 1 }}
                            ListHeaderComponent={headerContent}
                            data={posts}
                            renderItem={(postItem) => { return <PostItem post={postItem.item} /> }}
                            ListEmptyComponent={(
                                <View style={styles.emptyList}>
                                    <Text style={styles.emptyListText}>You have no posts yet...</Text>
                                </View>
                            )}
                        />
                    ) : (
                        <FlatList
                            keyExtractor={keyExtractor}
                            contentContainerStyle={{ flexGrow: 1 }}
                            ListHeaderComponent={headerContent}
                            data={posts}
                            renderItem={(postItem) => { return <PostItem post={postItem.item} /> }}
                            ListEmptyComponent={(
                                <View style={styles.loadingList}>
                                    <ActivityIndicator size={50} />
                                </View>
                            )}
                        />
                    )
            }
        </View>

    );
}

export default UserMenuScreen;