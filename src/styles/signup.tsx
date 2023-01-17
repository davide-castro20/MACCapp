import { makeStyles, ThemeOptions } from '@rneui/themed';

const createSignupStyles = makeStyles((theme: ThemeOptions) => ({
    backButtonView: {
        width: "100%",
        alignItems: 'flex-start'
    },
    backButtonText: {
        color: theme.colors.grey3,
        backgroundColor: 'transparent',
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    title: {
        fontSize: 35,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold',
        color: theme.colors.primary
    },
    inputGroup: {
        marginHorizontal: "10%",
        marginTop: 30
    },
    imageNamesView: {
        flexDirection: 'row',
        width: "100%",
    },
    namesView: {
        flex: 1,
        marginLeft: 10
    },
    firstNameView: {
        width: "100%"
    },
    lastNameView: {
        width: "100%"
    },


    signupButtonContainer: {
        marginTop: 20,
        marginHorizontal: "12%",
        marginBottom: 15
    },

    background: {
        backgroundColor: "#ffff"
    }
}));

export default createSignupStyles;