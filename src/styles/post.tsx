import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const postStyles = makeStyles((theme: ThemeOptions) => ({

    header: {

    },
    rightHeader: {

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
}));

export default postStyles;