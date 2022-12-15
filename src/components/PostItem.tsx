import { ListItem, Avatar, SpeedDial, Icon, Text } from '@rneui/themed'

import { Face } from '../types';

import postStyles from '../styles/post';

type Post = {
    creator: {
        photoURL: string,
        firstName: string,
        lastName: string,
        imageURL: string,
        username: string,
        faces: Face[],
        tags: string[]
    },
    text: string,
    //TODO
}

const Post = (props: any) => {

    const styles = postStyles(props);

    let post: Post = props.post;

    let photo = post.creator.photoURL == null ? "" : post.creator.photoURL;

    return (
        <ListItem bottomDivider >
            <Avatar source={{ uri: photo }} rounded={true} />
            <ListItem.Content>
                <ListItem.Title style={styles.header}>
                    <Text style={styles.name}>{post.creator.firstName} {post.creator.lastName}</Text>
                    <Text style={styles.username}>{" @"}{post.creator.username}</Text>
                </ListItem.Title>
                <ListItem.Subtitle style={styles.text}>{post.text}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
};

export default Post;