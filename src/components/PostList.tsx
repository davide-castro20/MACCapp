import { FlatList } from 'react-native';
import { ListItem, Avatar } from '@rneui/themed'

const PostList = (props) => {

    const keyExtractor = (item, index) => index.toString();

    const renderPost = (post) => {
        let photo = post.item.creator.photoURL == null ? "https://corsidilaurea.uniroma1.it/sites/default/files/styles/user_picture/public/pictures/picture-1367-1583680114.png?itok=J6Tp3g3Y" : post.item.creator.photoURL;
        console.log(photo)
        return (
            <ListItem bottomDivider >
                <Avatar source={{uri: photo}} />
                <ListItem.Content>  
                    <ListItem.Title>{post.item.text}</ListItem.Title>
                    <ListItem.Subtitle>{post.item.creatorData.firstName} {post.item.creatorData.lastName}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    }

    return ( 
    
    <FlatList
        keyExtractor={keyExtractor}
        data={props.posts}
        renderItem={renderPost}
        />
    );
};

export default PostList;