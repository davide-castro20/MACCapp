import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const homeStyles = makeStyles((theme: ThemeOptions) => ({

    backgroundPage: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
    }

}));

export default homeStyles;