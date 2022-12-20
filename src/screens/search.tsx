import React, { type PropsWithChildren, useState, useEffect, RefObject, useCallback } from 'react';

import {
    ActivityIndicator,
    FlatList,
    View,
} from 'react-native';

import {
    SearchBar,
    useTheme,
    Tab,
    Text,
    TabView
} from '@rneui/themed';

import createSearchStyles from '../styles/search';

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import PostItem from '../components/PostItem';
import UserItem from '../components/UserItem';


const SearchScreen = (props: any) => {

    const searchBar: RefObject<any> = React.createRef();

    const [searchText, setSearchText] = useState("");

    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    const styles = createSearchStyles(props);

    const theme = useTheme();

    const [index, setIndex] = React.useState(0);

    async function getPosts() {

        setLoadingPosts(true);

        let postsByTags: any = [];
        let postsByText: any = [];

        let postPromises: Promise<void | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>[] = [];

        postPromises.push(firestore()
            .collection('posts')
            .where('tags', 'array-contains', searchText)
            .get()
            .then(postDocs => {
                let newPosts: any = [];
                
                postDocs.forEach(postDoc => {
                    let postData = postDoc.data();
                    if (postData.creation_date) {
                        postData.creation_date = postData.creation_date.toDate();
                    }
                    postsByTags = [...newPosts, postData];
                });
            }));

        postPromises.push(firestore()
            .collection('posts')
            .where('textWords', 'array-contains-any', searchText.split(' '))
            .get()
            .then(postDocs => {
                let newPosts: any = [];
                postDocs.forEach(postDoc => {
                    let postData = postDoc.data();
                    if (postData.creation_date) {
                        postData.creation_date = postData.creation_date.toDate();
                    }
                    postsByText = [...newPosts, postData];
                });
            })
        )

        return Promise.all(postPromises).then(() => {

            let c = postsByTags.concat(postsByText);
            let postsSet = c.filter((item, pos) => c.indexOf(item) === pos);

            postsSet.sort(function (a, b) {
                return parseFloat(b.creation_date) - parseFloat(a.creation_date);
            });

            let postUserPromises: Promise<void | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>[] = [];

            postsSet.forEach(postData => {
                postUserPromises.push(
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
                        }));
            })

            Promise.all(postUserPromises).then(() => {
                setPosts(postsSet);
                setLoadingPosts(false);
            })
        })
    }

    async function getUsers() {

        setLoadingUsers(true);

        firestore()
            .collection('users')
            .where('username', '==', searchText)
            .onSnapshot(async usersDocs => {

                let newUsers: any = [];

                let userPromises: Promise<void>[] = [];
                usersDocs.forEach(userDoc => {

                    let promise = new Promise<void>(async (resolve, reject) => {
                        let userData = userDoc.data();
    
    
                        const profilePicUrl = await storage().ref(userData.photoURL).getDownloadURL();
                        userData.photoURL = profilePicUrl;
                        
                        userData.uid = userDoc.id;

                        newUsers = [...newUsers, userData];
                        resolve();
                    });

                    userPromises.push(promise);
                })

                Promise.all(userPromises).then(() => {
                    setUsers(newUsers);
                    setLoadingUsers(false);
                });
            });
    }

    const newSearch = () => {
        if (searchText.length == 0)
            return;

        getPosts();
        getUsers();
    };

    const keyExtractor = (_item: any, index: number) => index.toString();

    return (
        <View style={styles.page}>
            <SearchBar
                ref={searchBar}
                placeholder="Tags, text, users..."
                onChangeText={(text) => setSearchText(text)}
                containerStyle={styles.searchBarContainer}
                value={searchText}
                inputContainerStyle={styles.searchBarInputContainer}
                placeholderTextColor={theme.theme.colors.grey2}
                onSubmitEditing={newSearch}
            />

            {
                // ((loadingPosts || loadingUsers) || (posts.length == 0 && users.length == 0)) ? (
                (loadingPosts || loadingUsers) ? (
                    <ActivityIndicator />
                ) :
                    (
                        (posts.length == 0 && users.length == 0) ?
                            (
                                <>
                                </>
                            ) : (
                                <>
                                    <Tab
                                        value={index}
                                        onChange={(e) => setIndex(e)}

                                        indicatorStyle={styles.tabIndicator}
                                        variant="primary"

                                    >
                                        <Tab.Item
                                            icon={{ name: 'list', size: 18, type: 'font-awesome-5', color: theme.theme.colors.black }}
                                            containerStyle={styles.tabItem}
                                            buttonStyle={{ height: 45 }}
                                        />
                                        <Tab.Item
                                            icon={{ name: 'user-alt', size: 18, type: 'font-awesome-5', color: theme.theme.colors.black }}
                                            containerStyle={styles.tabItem}
                                            buttonStyle={{ height: 45 }}
                                        />
                                    </Tab>


                                    <TabView value={index} onChange={setIndex} animationType="spring">
                                        <TabView.Item style={styles.postTab}>
                                            <FlatList
                                                keyExtractor={keyExtractor}
                                                contentContainerStyle={{ flexGrow: 1 }}
                                                data={posts}
                                                renderItem={(postItem) => { return <PostItem post={postItem.item} /> }}
                                                ListEmptyComponent={(
                                                    <View style={styles.emptyList}>
                                                        <Text style={styles.emptyListText}>No posts that match your search.</Text>
                                                    </View>
                                                )}
                                            />
                                        </TabView.Item>
                                        <TabView.Item style={styles.userTab}>
                                            <FlatList
                                                keyExtractor={keyExtractor}
                                                contentContainerStyle={{ flexGrow: 1 }}
                                                data={users}
                                                renderItem={(userItem) => { return <UserItem user={userItem.item} /> }}
                                                ListEmptyComponent={(
                                                    <View style={styles.emptyList}>
                                                        <Text style={styles.emptyListText}>No users that match your search.</Text>
                                                    </View>
                                                )}
                                            />
                                        </TabView.Item>
                                    </TabView>
                                </>
                            )
                    )
            }

        </View>
    );
};

export default SearchScreen;