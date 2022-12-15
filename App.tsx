/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { type PropsWithChildren, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  // Text,
  useColorScheme,
  View,
  TextInput,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import {
  createTheme,
  useThemeMode,
  ThemeProvider,
  Text,
  Button,
  Image,
  makeStyles,
  ListItem,
} from '@rneui/themed';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

import styles from './src/styles/style';

import HomeScreen from './src/screens/home';
import UserMenuScreen from './src/screens/userMenu';
import CreatePostScreen from './src/screens/createPost';
import AddImageScreen from './src/screens/addImage';

import { Avatar, Icon, Skeleton } from '@rneui/base';

import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setUser } from './src/redux/user';

import AmbientLightListen from './src/components/AmbientLightListen';

import Toast from 'react-native-toast-message';

import { DEFAULT_AVATAR } from './src/images';



const appTheme = createTheme({
  mode: 'dark',
  components: {
    Button: {
      radius: 'sm',
    },
  },
  darkColors: {

  },
  lightColors: {

  }
});

const Stack = createNativeStackNavigator();


const App = () => {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState(true);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const user = useSelector(state => state.user.user);

  const dynamicMode = useSelector(state => state.dynamicMode.enabled);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    let userStore = {
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      uid: user.uid,
    };

    dispatch(setUser(userStore));
    if (loadingUser) getUserData(user);
    if (initializing) setInitializing(false);
  }

  function getUserData(user: any) {
    if (!user) return;

    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(newUserData => {

        let userDataDocument = newUserData.data();
        if (!userDataDocument.photoURL || userDataDocument.photoURL == "") {
          userDataDocument.photoURL = Image.resolveAssetSource(DEFAULT_AVATAR).uri;
        }
        
        dispatch(setUserData(userDataDocument));
        setLoadingUser(false);
      });
  }

  const userLogin = () => {
    if (email == '' || password == '') return;

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        getUserData(user);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
  }, []);


  if (initializing) return null;


  return (
    <>
    <NavigationContainer>
      <ThemeProvider theme={appTheme}>
        { dynamicMode &&
          <AmbientLightListen/>
        }
        {!user ? (
          <View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder="Email."
                placeholderTextColor="#003f5c"
                onChangeText={email => setEmail(email)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder="Password."
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={password => setPassword(password)}
              />
            </View>
            <Button type="solid" title="Login" onPress={userLogin} />
          </View>
        ) :
          (
            userData ? (
              <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen}
                  options={({ navigation }) => ({
                    headerTitle: "Timeline",
                    headerTitleStyle: styles.headerTitle,
                    headerStyle: styles.header,
                    headerLeft: () => (
                      <Avatar
                        source={{ uri: userData.photoURL }}
                        rounded={true}
                        size={40}
                        containerStyle={{marginRight: 8}}
                        onPress={() => navigation.push("UserMenu")}
                      />
                    ),
                    headerRight: () => (
                      <Icon reverse
                        size={20}
                        name='pen-nib'
                        type='font-awesome-5'
                        onPress={() => navigation.push("CreatePost")}
                      />
                    ),
                  })} />
                <Stack.Screen name="UserMenu" component={UserMenuScreen}
                  options={({ navigation }) => ({
                    headerTitle: "User menu",
                    headerStyle: styles.header,
                    headerTitleStyle: styles.headerTitle,
                    headerLeft: () => (
                      <Icon reverse
                        size={20}
                        name='arrow-left'
                        type='font-awesome-5'
                        onPress={() => navigation.goBack()}
                      />
                    ),
                  })} />
                <Stack.Screen name="CreatePost" component={CreatePostScreen}
                  options={({ navigation }) => ({
                    headerTitle: "Create Post",
                    headerStyle: styles.header,
                    headerTitleStyle: styles.headerTitle,
                    headerLeft: () => (
                      <Icon reverse
                        size={20}
                        name='arrow-left'
                        type='font-awesome-5'
                        onPress={() => navigation.goBack()}
                      />
                    ),
                  })} />
                <Stack.Screen name="AddImage" component={AddImageScreen}
                  options={({ navigation }) => ({
                    headerTitle: "Add Image",
                    headerStyle: styles.header,
                    headerTitleStyle: styles.headerTitle,
                    headerLeft: () => (
                      <Icon reverse
                        size={20}
                        name='arrow-left'
                        type='font-awesome-5'
                        onPress={() => navigation.goBack()}
                      />
                    ),
                  })} />
              </Stack.Navigator>
            )

              :
              <Stack.Navigator>
                <Stack.Screen name="Home" children={() => <HomeScreen user={user} />}
                  options={({ navigation }) => ({
                    headerTitle: "Timeline",
                    headerTitleStyle: styles.headerTitle,
                    headerStyle: styles.header,
                    headerLeft: () => (
                      <Skeleton
                        circle={true}
                        animation='pulse'
                        width={40}
                        style={{marginRight:10}}
                      />
                    ),
                  })} />
              </Stack.Navigator>
          )
        }


      </ThemeProvider>
    </NavigationContainer>
    <Toast
      position='bottom'
    />
    </>
  );
};



export default App;
