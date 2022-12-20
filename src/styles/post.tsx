import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const postStyles = makeStyles((theme: ThemeOptions) => ({

    header: {

    },
    rightHeader: {

    },
    itemContainer: {
        paddingBottom: 7,
    },
    text: {
        fontSize: 15
    },
    name: {
        color: theme.colors.black,
        fontWeight: 'bold',
        fontSize: 15
    },
    username: {
        color: theme.colors.grey2,
        fontSize: 14
    },
    image: {
    },
    imageContainer: {
        borderRadius: 8
    },
    imageDiv: {
        width: "100%",
        marginTop: 5
    },
    overlayImageContainer: {
    },
    overlayStyle: {
        padding: 0,
        borderRadius: 8,
        elevation: 5,
    },
    footer: {
        marginTop: 7,
        flex: 1, 
        width: "100%", 
        flexDirection: 'row', 
        justifyContent:'space-between',
    },
    footerText: {
        color: theme.colors.grey2
    },
    locationIcon: {
        color: theme.colors.grey2
    },
    locationIconContainer: {
        marginRight: 5
    }
}));

export default postStyles;