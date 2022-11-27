/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren, useState, useEffect} from 'react';
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

import {Colors} from 'react-native/Libraries/NewAppScreen';

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

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import PostList from './src/components/PostList';

// const Section: React.FC<
//   PropsWithChildren<{
//     title: string;
//   }>
// > = ({children, title}) => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

const theme = createTheme({
  mode: 'dark',
  components: {
    Button: {
      radius: 'sm',
    },
  },
});

const App = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [userData, setUserData] = useState();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);

  function getPosts(user: any) {
    if (!user) return;

    setLoadingPosts(true);

    return firestore()
      .collection('posts')
      .where('creator', '==', user.uid)
      .onSnapshot(postsSnapshot => {
        setPosts([]);
        postsSnapshot.forEach(postSnap => {
          let postData = postSnap.data();
          firestore()
            .collection('users')
            .doc(postData.creator)
            .get()
            .then(postCreator => {
              console.log(postCreator.data());
              postData.creator = postData.creator;
              postData.creatorData = postCreator.data();
              console.log(postData);
              setPosts([...posts, postData]);
            });
        });
        console.log(posts);
        setLoadingPosts(false);
      });
  }

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
    if (loadingUser) getUserData(user);
    getPosts(user);
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
      ) : (
        <View>
          {userData && (
            <Text style={styles.sectionTitle}>
              Welcome {userData.firstName} {userData.lastName}
            </Text>
          )}
          {
            loadingPosts ? (
              <ActivityIndicator />
            ) : (
              // <ScrollView>
              <PostList posts={posts} />
            )
            // </ScrollView>
          }
        </View>
      )}
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
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
  textInput: {},
  inputView: {
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default App;
