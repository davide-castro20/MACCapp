import React, { type PropsWithChildren, useState, useEffect, RefObject, useCallback } from 'react';

import {
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

        // setLoadingPosts(true);

        // return firestore()
        //     .collection('posts')
        //     .where('creator', '==', user.uid)
        //     //.where('creator', 'in', userData.following)
        //     .orderBy('creation_date', 'desc')
        //     .onSnapshot(postsSnapshot => {
        //         let newPosts: any = [];
        //         let postPromises: Promise<void | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>[] = [];

        //         postsSnapshot.forEach(postSnap => {
        //             let postData = postSnap.data();


        //             // In the case the post is just created, the date is not available yet in the first snapshot 
        //             // because it is created by firebase serverside
        //             if (postData.creation_date) {
        //                 postData.creation_date = postData.creation_date.toDate();
        //             }

        //             postPromises.push(
        //                 firestore()
        //                     .collection('users')
        //                     .doc(postData.creator)
        //                     .get()
        //                     .then(async postCreator => {

        //                         if (postData.image && postData.image != "") {
        //                             const postImageUrl = await storage().ref(postData.image).getDownloadURL();
        //                             postData.image = postImageUrl;
        //                         }

        //                         postData.creator = postCreator.data();
        //                         const profilePicUrl = await storage().ref(postData.creator.photoURL).getDownloadURL();
        //                         postData.creator.photoURL = profilePicUrl;
        //                         newPosts = [...newPosts, postData];
        //                     }));
        //         });

        //         Promise.all(postPromises).then(() => {
        //             setPosts(newPosts);
        //             setLoadingPosts(false);
        //         })
        //     });
    }

    async function getUsers() {
        // firestore()
        // .collection('users')
        // .doc(postData.creator)
        // .get()
        // .then(async postCreator => {

        //     if (postData.image && postData.image != "") {
        //         const postImageUrl = await storage().ref(postData.image).getDownloadURL();
        //         postData.image = postImageUrl;
        //     }

        //     postData.creator = postCreator.data();
        //     const profilePicUrl = await storage().ref(postData.creator.photoURL).getDownloadURL();
        //     postData.creator.photoURL = profilePicUrl;
        //     newPosts = [...newPosts, postData];
        // }));
    }

    const newSearch = () => {
        if (searchText.length == 0)
            return;

        getPosts();
        getUsers();
    };

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
                ((loadingPosts || loadingUsers) || (posts.length == 0 && users.length == 0)) ? (
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
                                icon={{ name: 'list', size: 18, type: 'font-awesome-5', color: 'white' }}
                                containerStyle={styles.tabItem}
                                buttonStyle={{ height: 45 }}
                            />
                            <Tab.Item
                                icon={{ name: 'user-alt', size: 18, type: 'font-awesome-5', color: 'white' }}
                                containerStyle={styles.tabItem}
                                buttonStyle={{ height: 45 }}
                            />
                        </Tab>


                        <TabView value={index} onChange={setIndex} animationType="spring">
                            <TabView.Item style={styles.postTab}>
                                <Text h1>Recent</Text>
                            </TabView.Item>
                            <TabView.Item style={styles.userTab}>
                                <Text h1>Favorite</Text>
                            </TabView.Item>
                        </TabView>
                    </>
                )
            }

        </View>
    );
};

export default SearchScreen;