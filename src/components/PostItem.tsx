import { ListItem, Avatar, SpeedDial, Icon } from '@rneui/themed'

import { Face } from '../types';

type Post = {
    creator: {
        photoURL: string,
        firstName: string,
        lastName: string,
        imageURL: string,
        faces: Face[],
        tags: string[]
    },
    text: string,
    //TODO
}

const Post = (props: any) => {
    let post: Post = props.post;

    let photo = post.creator.photoURL == null ? "" : post.creator.photoURL;
        return (
            <ListItem bottomDivider >
                <Avatar source={{ uri: photo }} rounded={true} />
                <ListItem.Content>
                    <ListItem.Title>{post.text}</ListItem.Title>
                    <ListItem.Subtitle>{post.creator.firstName} {post.creator.lastName}</ListItem.Subtitle>
                </ListItem.Content>
                {/* <ListItem.Chevron /> */}
            </ListItem>
        );
};

export default Post;