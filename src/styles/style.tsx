import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const createAppStyles = makeStyles((theme: ThemeOptions) => ({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    box: {},
    textInput: {
        color: '#000'
    },
    inputView: {
        borderRadius: 30,
        width: '70%',
        height: 45,
        marginBottom: 20,
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#0073b5',
    },
    headerTitle: {
        color: '#fff',
    },

    loginPage: {
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: "10%"
    },
    logo: {
        height: "20%",
        marginBottom: 20
    },
    loginInput: {

    },
    loginButton: {
        marginHorizontal: 10
    }
}));

export default createAppStyles;