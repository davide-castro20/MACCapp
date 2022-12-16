import { View, Dimensions } from 'react-native';
import { useCallback, useState } from 'react';

import { ListItem, Avatar, SpeedDial, Icon, Text, Image, Overlay, Button } from '@rneui/themed'

import { Face } from '../types';

import postStyles from '../styles/post';

type Post = {
    creator: {
        photoURL: string,
        firstName: string,
        lastName: string,
        username: string,

    },
    image: string,
    faces: Face[],
    tags: string[]
    text: string,
    location: string,
    //TODO
}

const Post = (props: any) => {

    const styles = postStyles(props);

    let post: Post = props.post;

    let photo = post.creator.photoURL == null ? "" : post.creator.photoURL;

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const [overlayWidth, setOverlayWidth] = useState(0);
    const [overlayHeight, setOverlayHeight] = useState(0);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [overlayVisible, setOverlayVisible] = useState(false);
    

    const onLayout = useCallback((event: any) => {
        const containerWidth = event.nativeEvent.layout.width;

        Image.getSize(post.image, (w, h) => {

            let width = containerWidth;

            let height = width * h / w;
            let excessHeight = (windowHeight / 3) / height;

            if (excessHeight < 1) {
                width *= (excessHeight);
                height = width * h / w;
            }

            setWidth(width);
            setHeight(height);
        });

    }, []);

    const onLayoutOverlay = useCallback((event: any) => {
        const containerWidth = event.nativeEvent.layout.width;

        Image.getSize(post.image, (w, h) => {

            let width = containerWidth;

            let height = width * h / w;
            let excessHeight = (windowHeight * 0.9) / height;

            if (excessHeight < 1) {
                width *= (excessHeight);
                height = width * h / w;
            }

            setOverlayWidth(width);
            setOverlayHeight(height);
        });

    }, []);

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };

    return (
        <>
            <ListItem bottomDivider containerStyle={styles.itemContainer} >
                <Avatar source={{ uri: photo }} rounded={true} containerStyle={{ alignSelf: 'flex-start', marginTop: 5 }} />
                <ListItem.Content style={{ width: "100%", paddingRight: "10%"}}>
                    <ListItem.Title style={styles.header}>
                        <Text style={styles.name}>{post.creator.firstName} {post.creator.lastName}</Text>
                        <Text style={styles.username}>{" @"}{post.creator.username}</Text>
                    </ListItem.Title>

                    {post.text != "" &&

                        <ListItem.Subtitle style={styles.text}>{post.text}</ListItem.Subtitle>
                    }

                    {post.image && post.image != "" &&

                        <View style={styles.imageDiv} onLayout={onLayout}>
                            <Image
                                containerStyle={{ ...styles.imageContainer, width: "100%", height: height }}
                                source={{ uri: post.image }}
                                resizeMode="cover"
                                onPress={() => toggleOverlay()}
                            />
                        </View>
                    }

                    {
                        <View style={styles.footer}> 
                            {
                                post.location && post.location != "" &&
                                <Icon
                                    size={15}
                                    iconStyle={styles.locationIcon}
                                    containerStyle={styles.locationIconContainer}
                                    name='map-marker-alt'
                                    type='font-awesome-5'
                                />
                            }
                            <Text 
                                style={{...styles.footerText, paddingRight: 40, flex: 1, flexWrap: 'wrap'}} 
                                ellipsizeMode={'tail'} numberOfLines={1}
                            >
                                {post.location}
                            </Text>
                            <Text style={styles.footerText}>01/12 · 15:60</Text>
                        </View>
                    }

                </ListItem.Content>
            </ListItem>

            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{ width: (windowWidth * 0.85), ...styles.overlayStyle }}>
                <View onLayout={onLayoutOverlay} style={{ width: "100%" }}>
                    <Image
                        containerStyle={{ ...styles.imageContainer, width: overlayWidth, height: overlayHeight, ...styles.overlayImageContainer }}
                        source={{ uri: post.image }}
                        resizeMode="contain" />
                </View>
            </Overlay>
        </>
    );
};

export default Post;