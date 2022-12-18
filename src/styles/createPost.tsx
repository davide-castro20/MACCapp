import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const createPostStyles = makeStyles((theme: ThemeOptions) => ({
    textInput: {
        color: theme.colors.black,
    },
    inputViewPost: {
        borderRadius: 30,
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
    },
    inputViewTags: {
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    inputGroup: {
        marginLeft: "5%",
        marginRight: "5%",
        flex: 1,
        justifyContent: 'space-between'
    },
    textInputContainer: {
        flex: 1,
    },
    tagsInputContainer: {

    },
    backgroundPage: {
        backgroundColor: theme.colors.background,
        justifyContent: 'space-between',
        flexGrow: 1,
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
        backgroundColor: theme.colors.background,
        marginHorizontal: "10%",
        marginVertical: 10,
    },
    imagePreviewContainer: {
    },
    imagePreview: {
        height: "100%",
        borderRadius: 8,
    },
    imageButton: {
        width: "100%",
        flexGrow: 1,
        justifyContent: 'center',
        borderColor: theme.colors.black,
        borderWidth: 0.5,
        borderRadius: 8
    },
    imageInput: {
        flex: 1,
        marginHorizontal: "5%"
    },
    createButton: {
        width: "100%",
    },
    changeImage: {
        marginBottom: 10,
    },
    tagsView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: "5%",
        flexWrap: 'wrap'
    },
    buttonsView: {
        marginVertical: 10,
        marginHorizontal: "5%",
    },
}));

export default createPostStyles;