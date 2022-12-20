import { View } from 'react-native';
import { useCallback, useState } from 'react';

import { ListItem, Avatar, SpeedDial, Icon, Text, Image, Overlay, Button } from '@rneui/themed'

import createUserItemStyles from '../styles/userItem';
import { useSelector } from 'react-redux';

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


type User = {
    firstName: string,
    lastName: string,
    followers: string[],
    following: string[],
    photoURL: string,
    username: string,
    uid: string,
}

const UserItem = (props: any) => {

    const styles = createUserItemStyles(props);

    const currentUser = useSelector((state: any) => state.user);

    let user: User = props.user;

    const unfollowUser = (uid: string) => {
        firestore()
            .collection('users')
            .doc(currentUser.user.uid)
            .update({
                following: firestore.FieldValue.arrayRemove(uid),
            });

        firestore()
            .collection('users')
            .doc(uid)
            .update({
                followers: firestore.FieldValue.arrayRemove(currentUser.user.uid),
            });
    }

    const followUser = (uid: string) => {
        firestore()
            .collection('users')
            .doc(currentUser.user.uid)
            .update({
                following: firestore.FieldValue.arrayUnion(uid),
            });

        firestore()
            .collection('users')
            .doc(uid)
            .update({
                followers: firestore.FieldValue.arrayUnion(currentUser.user.uid),
            });
    }

    return (
        <ListItem bottomDivider containerStyle={styles.itemContainer} >
            <Avatar source={{ uri: user.photoURL }} rounded={true} containerStyle={{ alignSelf: 'flex-start', marginTop: 5 }} />
            <ListItem.Content style={{ width: "100%", paddingRight: "10%" }}>
                <ListItem.Title>
                    <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                </ListItem.Title>
                <ListItem.Title>
                    <Text style={styles.username}>@{user.username}</Text>
                </ListItem.Title>

                <View style={styles.statsView}>
                    <View style={styles.singleStat}>
                        <Text style={styles.statText}>{user.followers.length}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.singleStat}>
                        <Text style={styles.statText}>{user.following.length}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>
            </ListItem.Content>
            {
                currentUser.user.uid !== user.uid &&

                <ListItem.Content right>
                    {
                        user.followers.includes(currentUser.user.uid) ?
                            (
                                <Button
                                    buttonStyle={styles.alreadyFollowButton}
                                    onPress={() => unfollowUser(user.uid)}
                                >
                                    <Icon
                                        name='check'
                                        type='font-awesome-5'
                                        size={15}
                                    />
                                    <Text style={styles.followButtonText}>Following</Text>
                                </Button>
                            ) : (
                                <Button
                                    onPress={() => followUser(user.uid)}
                                >
                                    <Icon
                                        name='plus'
                                        type='font-awesome-5'
                                        size={15}
                                    />
                                    <Text style={styles.followButtonText}>Follow</Text>
                                </Button>
                            )
                    }
                </ListItem.Content>
            }

        </ListItem>
    )
}

export default UserItem;