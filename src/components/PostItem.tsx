import { View, Dimensions, ImageBackground } from 'react-native';
import { useCallback, useState } from 'react';

import { ListItem, Avatar, SpeedDial, Icon, Text, Image, Overlay, Button, FAB, useTheme } from '@rneui/themed'

import { Face } from '../types';

import postStyles from '../styles/post';
import Svg, { Rect, Text as TextSVG } from 'react-native-svg';

import { ImageDimensions } from '../types';

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
    creation_date: Date
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

    const [facesOffset, setFacesOffset] = useState({ vertical: 0, horizontal: 0 });
    const [showingFaces, setShowingFaces] = useState(false);

    const theme = useTheme();

    const onLayout = useCallback((event: any) => {
        const containerWidth = event.nativeEvent.layout.width;

        let dimensions: ImageDimensions = { width: 0, height: 0 };

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

    }, [post.image]);

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

    }, [post.image]);

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
        setShowingFaces(false);
    };

    return (
        <>
            <ListItem bottomDivider containerStyle={styles.itemContainer} >
                <Avatar
                    source={{ uri: photo }}
                    rounded={true}
                    containerStyle={{ alignSelf: 'flex-start', marginTop: 5 }} />
                <ListItem.Content style={{ width: "100%", paddingRight: "10%" }}>
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
                                style={{ ...styles.footerText, paddingRight: 40, flex: 1, flexWrap: 'wrap' }}
                                ellipsizeMode={'tail'} numberOfLines={1}
                            >
                                {post.location}
                            </Text>
                            <Text style={styles.footerText}>
                                {post.creation_date &&
                                    <>
                                        {String(post.creation_date.getDate()).padStart(2, '0')}
                                        /
                                        {String(post.creation_date.getMonth() + 1).padStart(2, '0')}
                                        {' · '}
                                        {String(post.creation_date.getHours()).padStart(2, '0')}
                                        :
                                        {String(post.creation_date.getMinutes()).padStart(2, '0')}
                                    </>
                                }
                            </Text>
                        </View>
                    }

                </ListItem.Content>
            </ListItem>

            <Overlay isVisible={overlayVisible} backdropStyle={{ backgroundColor: 'black', opacity: 0.75 }} onBackdropPress={toggleOverlay} overlayStyle={{ width: (windowWidth * 0.85), ...styles.overlayStyle }}>
                <View onLayout={onLayoutOverlay} style={{ width: "100%" }}>
                    <ImageBackground
                        imageStyle={{ borderRadius: 8 }}
                        style={{ ...styles.imageContainer, width: overlayWidth, height: overlayHeight, ...styles.overlayImageContainer }}
                        source={{ uri: post.image }}
                        resizeMode="contain" onLayout={(event) => {
                            const { width, height } = event.nativeEvent.layout;
                            let ratioOriginal = width / height;
                            let ratioContainer = width / height;

                            if (ratioOriginal > ratioContainer) {
                                let newFacesOffsetVertical = Math.round((1 - (ratioContainer / ratioOriginal)) * 100);
                                setFacesOffset({ vertical: newFacesOffsetVertical, horizontal: 0 });

                            } else if (ratioOriginal < ratioContainer) {
                                let newFacesOffsetHorizontal = Math.round((1 - (ratioOriginal / ratioContainer)) * 100); 1
                                setFacesOffset({ vertical: 0, horizontal: newFacesOffsetHorizontal });
                            }

                        }}
                    >
                        {post.faces && showingFaces &&
                            <>
                            <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
                                {

                                    Array.from(post.faces?.values()).map((face: Face) => (
                                        <View>
                                            <Rect
                                                x={((face.left * (1 - (facesOffset.horizontal / 100))) + Math.round(facesOffset.horizontal / 2)) + "%"}
                                                y={((face.top * (1 - (facesOffset.vertical / 100))) + Math.round(facesOffset.vertical / 2)) + "%"}
                                                width={(face.width * (1 - (facesOffset.horizontal / 100))) + "%"}
                                                height={(face.height * (1 - (facesOffset.vertical / 100))) + "%"}
                                                stroke={"white"}
                                                key={face.id}
                                                id={"face " + face.id}
                                                strokeWidth="3"
                                                strokeOpacity={0.7}
                                            />

                                            {
                                                face.user &&
                                                <TextSVG
                                                    x={((face.centerX * (1 - (facesOffset.horizontal / 100))) + Math.round(facesOffset.horizontal / 2)) + "%"}
                                                    y={(((face.top * (1 - (facesOffset.vertical / 100))) + Math.round(facesOffset.vertical / 2)) - 1.5) + "%"}
                                                    stroke="#000" fill="#fff" textAnchor="middle" strokeWidth={0.8}
                                                    fillOpacity={1}
                                                    opacity={0.7}
                                                    fontSize={20}
                                                    >{face.user.username}
                                                </TextSVG>
                                            }

                                        </View>

                                    ))
                                }

                            </Svg>
                            
                            </>
                        }
                    </ImageBackground>
                    
                </View>
                {post.faces && post.faces.length > 0 &&
                    <FAB
                        visible={true}
                        onPress={() => setShowingFaces(!showingFaces)}
                        size={'small'}
                        placement="right"
                        containerStyle={{opacity: 0.7, borderWidth: 0.5}}
                        icon={{ name: 'users', type: 'font-awesome-5', color: showingFaces ? 'black' : 'white', size: 17 }}
                        color={!showingFaces ? theme.theme.colors.primary : theme.theme.colors.black}
                    />
                }
            </Overlay>
        </>
    );
};

export default Post;