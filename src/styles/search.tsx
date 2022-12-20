import { makeStyles, ThemeOptions } from '@rneui/themed';

const createSearchStyles = makeStyles((theme: ThemeOptions) => ({
    page: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    searchBarContainer: {
        backgroundColor: theme.colors.background,
        borderWidth: 0,
        borderBottomColor: theme.colors.grey5,
        borderBottomWidth: 2,
        borderTopWidth: 0,
        padding: 0,
    },
    searchBarInputContainer: {
        borderRadius: 0,
        backgroundColor: theme.colors.background
    },
    tabItem: {
        backgroundColor: theme.colors.background,
    },
    tabIndicator: {
        backgroundColor: theme.colors.primary,
        height: 2
    },
    postTab: {
        flex: 1,
    },
    userTab: {
        flex: 1,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.black,
    },
    emptyListText: {
        color: theme.colors.black,
        fontSize: 20,
    },
}));

export default createSearchStyles;