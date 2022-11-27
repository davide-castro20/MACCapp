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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import styles from './src/styles/style';

import HomeScreen from './src/screens/home';
import CreatePostScreen from './src/screens/createPost';

import { Avatar, Icon } from '@rneui/base';


const theme = createTheme({
  mode: 'dark',
  components: {
    Button: {
      radius: 'sm',
    },
  },
});

const Stack = createNativeStackNavigator();

const App = () => {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [userData, setUserData] = useState();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (loadingUser) getUserData(user);
    if (initializing) setInitializing(false);
  }

  function getUserData(user: any) {
    if (!user) return;

    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(userData => {
        console.log(userData)
        setUserData(userData.data());
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
    <NavigationContainer>
      <ThemeProvider theme={theme}>
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
                <Stack.Screen name="Home" children={() => <HomeScreen user={user} />}
                  options={({navigation}) => ({
                    headerTitle: "Timeline",
                    headerLeft: () => (
                      <Avatar
                        source={{ uri: userData.photoURL }}
                        rounded={true}
                        size={40}
                        onPress={() => { alert('user settings'); }}
                      />
                    ),
                    headerRight: () => (
                      <Icon reverse
                      size={20}
                      name='pen-nib'
                      type='font-awesome-5'
                      onPress={ () => navigation.push("CreatePost") }
                      />
                    ),
                  })} />
                <Stack.Screen name="CreatePost" children={() => <CreatePostScreen user={user} />}
                  options={({navigation}) => ({
                    headerTitle: "Create Post",
                    headerLeft: () => (
                      <Icon reverse
                        size={20}
                        name='arrow-left'
                        type='font-awesome-5'
                        onPress={ () => navigation.goBack() }
                      />
                    ),
                  })} />
              </Stack.Navigator>
            )

              :
              <ActivityIndicator />
          )
        }


      </ThemeProvider>
    </NavigationContainer>
  );
};



export default App;
