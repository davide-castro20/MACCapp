import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    ScrollView
} from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon, Switch, useThemeMode, ThemeMode, Divider, useTheme, Button, Input, Image, Dialog } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import createSignupStyles from '../styles/signup';

import Toast from 'react-native-toast-message';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { DEFAULT_AVATAR, DEFAULT_ADD_AVATAR } from '../images';

import * as ImagePicker from 'react-native-image-picker';
import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker/lib/typescript/types';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../redux/user';


const Signup = (props: any) => {

    const theme = useTheme();

    const styles = createSignupStyles(props);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");

    const [signingUp, setSigningup] = useState(false);
    const [tried, setTried] = useState(false);

    const defaultAddAvatar = Image.resolveAssetSource(DEFAULT_ADD_AVATAR).uri;

    const [profilePic, setProfilePic] = useState(defaultAddAvatar);
    const [picResponse, setPicResponse] = useState<any>(null);
    const [triedProfilePic, setTriedProfilePic] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);



    const basicInputCheck = () => {
        if (firstName == "" || lastName == "") {
            return false;
        }

        if (username == "") {
            return false;
        }

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (reg.test(email) === false) {
            // invalid email
            return false;
        }

        if (password.length < 6) {
            return false;
        }

        if (password != confirmPassword) {
            return false;
        }

        return true;
    }

    const pickImageButton = useCallback((type: string, options: ImageLibraryOptions | CameraOptions) => {
        if (type == "library") {
            ImagePicker.launchImageLibrary(options, setPicResponse);
        } else if (type == "capture") {
            ImagePicker.launchCamera(options, setPicResponse);
        }
    }, []);

    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    }

    useEffect(() => {
        if (picResponse?.assets) {
            let uri = picResponse.assets[0].uri;

            setProfilePic(uri);
            setTriedProfilePic(true);
        }
    }, [picResponse]);

    const removeImage = () => {
        setTriedProfilePic(false);

        setProfilePic(Image.resolveAssetSource(DEFAULT_ADD_AVATAR).uri);
    }


    const signup = () => {

        setSigningup(true);

        if (!tried)
            setTried(true);

        setUsernameError("");
        setEmailError("");

        if (basicInputCheck() == false) {
            setSigningup(false);
            return;
        }

        firestore()
            .collection('users')
            .where('username', '==', username)
            .get()
            .then((userDocs) => {
                if (userDocs.size > 0) {
                    setUsernameError('Username already in use')

                    setSigningup(false);
                    return;
                }

                auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(async (user) => {
                        
                        let newUser = user.user;

                        let noPic = profilePic == defaultAddAvatar;

                        let imageReference = null;

                        if (!noPic) {
                            let imageUUID = uuidv4();
                            imageReference = storage().ref(`profile_pics/${imageUUID}.png`);
                            const pathToFile = profilePic;

                            await imageReference.putFile(pathToFile);

                            console.log("wrf")
                            console.log(imageReference);
                            if (imageReference == null)
                            {
                                newUser
                                .delete()
                                .then(() => {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'There has been a problem signing up.',
                                        text2: 'Please try again later'
                                    })
                                })
                            }
                        }

                        console.log("now yes")
                        
                        firestore()
                            .collection('users')
                            .doc(newUser.uid)
                            .set(
                                {
                                    firstName: firstName,
                                    lastName: lastName,
                                    followers: [],
                                    following: [],
                                    username: username,
                                    photoURL: (noPic || !imageReference) ? "profile_pics/default.png" : imageReference.fullPath
                                }
                            )
                            .then(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Signup successful!'
                                });
                                props.setSignUp(false);
                                setUser(newUser);
                            })
                            .catch(error => {
                                console.log(error);

                                newUser.delete()
                                    .then(() => {
                                        Toast.show({
                                            type: 'error',
                                            text1: 'There has been a problem signing up.',
                                            text2: 'Please try again later'
                                        })
                                    })
                            })
                    })
                    .catch(error => {
                        console.error(error);

                        if (error.code === 'auth/email-already-in-use') {
                            setEmailError('That email address is already in use!');
                        }

                        if (error.code === 'auth/invalid-email') {
                            setEmailError('That email address is invalid!');
                        }

                        setSigningup(false);
                        return;
                    })
            })
    }

    return (
        <ScrollView
            stickyHeaderIndices={[0]}
            style={styles.background}
        >
            <View style={styles.backButtonView}>
                <Button
                    type='clear'
                    titleStyle={styles.backButtonText}
                    containerStyle={{ flexShrink: 1 }}
                    icon={{ name: 'arrow-left', type: 'font-awesome-5', color: theme.theme.colors.grey3, size: 15 }}
                    onPress={() => props.setSignUp(false)}
                >
                    Back to Login
                </Button>
            </View>
            <Text
                style={styles.title}
            >Sign Up</Text>

            <View style={styles.inputGroup}>
                <View style={styles.imageNamesView}>
                    <Avatar
                        containerStyle={{ alignSelf: 'center' }}
                        rounded={true}
                        source={{ uri: profilePic }}
                        size={125}
                        onPress={toggleDialog}
                    ></Avatar>

                    <Dialog
                        isVisible={dialogVisible}
                        onBackdropPress={toggleDialog}
                        overlayStyle={{ backgroundColor: 'white' }}
                    >
                        <Text style={{ color: "#000" }}>How do you want to pick the image?</Text>
                        <Dialog.Actions>
                            <Dialog.Button
                                title="Image Gallery"
                                titleStyle={{ color: theme.theme.colors.primary }}
                                icon={{ name: 'image', type: 'font-awesome-5', color: theme.theme.colors.primary }}
                                onPress={() => {
                                    toggleDialog();
                                    pickImageButton('library', {
                                        selectionLimit: 1,
                                        mediaType: 'photo',
                                        includeBase64: false,
                                    });
                                }}
                            />
                            <Dialog.Button
                                title="Camera"
                                titleStyle={{ color: theme.theme.colors.primary }}
                                icon={{ name: 'camera', type: 'font-awesome-5', color: theme.theme.colors.primary }}
                                onPress={() => {
                                    toggleDialog();
                                    pickImageButton('capture', {
                                        selectionLimit: 1,
                                        mediaType: 'photo',
                                        includeBase64: false,
                                    });
                                }}
                            />
                            {
                                triedProfilePic &&
                                <Dialog.Button
                                    title="Remove picture"
                                    titleStyle={{ color: theme.theme.colors.error }}
                                    icon={{ name: 'trash', type: 'font-awesome-5', color: theme.theme.colors.error }}
                                    onPress={() => {
                                        toggleDialog();
                                        removeImage();
                                    }}
                                />

                            }
                        </Dialog.Actions>
                    </Dialog>

                    <View style={styles.namesView}>
                        <View style={styles.firstNameView}>
                            <Input
                                inputStyle={{ color: "#000" }}
                                label={"First Name"}
                                errorMessage={
                                    firstName == "" && tried ?
                                        "You must insert a first name"
                                        :
                                        ""
                                }
                                onChangeText={value => setFirstName(value)}
                            />
                        </View>
                        <View style={styles.lastNameView}>
                            <Input
                                inputStyle={{ color: "#000" }}
                                label={"Last Name"}
                                errorMessage={
                                    lastName == "" && tried ?
                                        "You must insert a last name"
                                        :
                                        ""
                                }
                                onChangeText={value => setLastName(value)}
                            />
                        </View>
                    </View>
                </View>

                <View>
                    <Input
                        inputStyle={{ color: "#000" }}
                        label={"Username"}
                        onChangeText={value => setUsername(value)}
                        errorMessage={
                            username == "" && tried ?
                                "You must insert a username"
                                :
                                usernameError != "" ?
                                    usernameError
                                    :
                                    ""
                        }
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Input
                        inputStyle={{ color: "#000" }}
                        label={"E-mail"}
                        errorMessage={
                            email == "" && tried ?
                                "You must insert an e-mail address"
                                :
                                email != "" && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email) ?
                                    'Invalid e-mail address!'
                                    :
                                    emailError ?
                                    emailError
                                    :
                                    ""
                        }
                        value={email}
                        renderErrorMessage={false}
                        //     
                        // }
                        onChangeText={value => setEmail(value)}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Input
                        secureTextEntry
                        inputStyle={{ color: "#000" }}
                        label={"Password"}
                        errorMessage={
                            password == "" && tried ?
                                "You must insert a password"
                                :
                                password != "" && password.length < 6 ?
                                    "Password must be at least 6 characters long"
                                    :
                                    ""
                        }
                        onChangeText={value => setPassword(value)}
                    />
                </View>

                <View>
                    <Input
                        secureTextEntry
                        inputStyle={{ color: "#000" }}
                        label={"Confirm Password"}
                        errorMessage={
                            confirmPassword != "" && confirmPassword != password ?
                                "Password confirmation does not match"
                                :
                                ""
                        }
                        onChangeText={value => setConfirmPassword(value)}
                    />
                </View>
            </View>

            <Button
                containerStyle={styles.signupButtonContainer}
                onPress={signup}
                disabled={signingUp || !basicInputCheck()}
            >
                Sign Up
            </Button>
        </ScrollView>
    );
}

export default Signup;