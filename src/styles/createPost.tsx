import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const createPostStyles = makeStyles((theme: ThemeOptions) => ({
    textInput: {
        color: theme.colors.black,
    },
    inputView: {
        borderRadius: 30,
        width: '100%',
        height: 45,
        marginBottom: 20,
        alignItems: 'center',
    },
    inputGroup: {
        width: "100%"
    },
    backgroundPage: {
        backgroundColor: theme.colors.background,
        flex:1,
    },
    loadingDialogBackdrop: {
        backgroundColor: theme.colors.grey2,
        height: "100%",
        width: "100%",
        opacity: 0.7,

    },
    loadingDialogContainer: {
        backgroundColor: theme.colors.grey2,
        height: "100%",
        width: "100%",
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: 0.7,
    },
    loadingLoadingStyle: {
        color: theme.colors.primary,
    },
    imagePreviewBackground: {
        flex: 1,
        backgroundColor: theme.colors.grey3,
    },
    imagePreviewContainer: {
        flex: 1,
        marginHorizontal: "10%",
    },
    imagePreview: {
        height: "100%"
    },
}));

export default createPostStyles;