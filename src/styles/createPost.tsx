import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const createPostStyles = makeStyles((theme: ThemeOptions) => ({
    textInput: {
        color: "#000"
    },
    inputView: {
        borderRadius: 30,
        width: '70%',
        height: 45,
        marginBottom: 20,
        alignItems: 'center',
    },
    backgroundPage: {
        backgroundColor: theme.colors.background
    }
}));

export default createPostStyles;