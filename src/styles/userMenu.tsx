import { color } from '@rneui/base';
import { makeStyles, ThemeOptions } from '@rneui/themed';

const createUserMenuStyles = makeStyles((theme: ThemeOptions) => ({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 5

    },
    profileInfoView: {
        flexDirection: 'row'
    },
    profileAvatarView: {
        padding: 15
    },
    avatarContainer: {
        
    },
    sideInfoView: {
        flex: 1,
        paddingTop: 17
    },
    userFullName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: theme.colors.black
    },
    username: {
        color: theme.colors.grey2,
        fontSize: 15
    },
    statsView: {
        flexDirection: 'row',
        marginTop: 12
    },
    singleStat: {
        flexDirection: 'row',
    },
    statNumber: {
        fontWeight: 'bold',
        marginRight: 5,
        color: theme.colors.black
    },
    statText: {
        color: theme.colors.black
    },
    optionsView: {
        paddingHorizontal: 20
    },
    dynamicOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingVertical: 10
    },
    darkOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 15
    },
    optionText: {
        textAlignVertical: 'center',
        color: theme.colors.black,
        fontSize: 16
    },
    optionTextDisabled: {
        textAlignVertical: 'center',
        color: theme.colors.grey4,
        fontSize: 16
    },
    settingsTitle: {
        color: theme.colors.black,
        fontSize: 19,
        marginLeft: 20,
        marginTop: 10,
        fontWeight: 'bold',
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.black,
        minHeight: 200,
    },
    emptyListText: {
        color: theme.colors.black,
        fontSize: 20,
    },
    loadingList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.black,
    },
}));

export default createUserMenuStyles;