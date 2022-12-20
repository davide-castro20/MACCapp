import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const createUserItemStyles = makeStyles((theme: ThemeOptions) => ({
    itemContainer: {
        paddingBottom: 7,
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
    followButtonText: {
        marginLeft: 7,
    },
    alreadyFollowButton: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.black
    },
    statsView: {
        marginTop: 5,
    },
    singleStat: {
        flexShrink: 1,
        flexDirection: 'row',
    },
    statLabel: {

    },
    statText: {
        marginRight: 10,
        fontWeight: 'bold'
    },
}));

export default createUserItemStyles;