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
        
    },
    userTab: {

    }
}));

export default createSearchStyles;