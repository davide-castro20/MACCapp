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
} from '@rneui/themed';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const userLogin = () => {
    if (email == "" || password == "") 
      return;

    auth().signInWithEmailAndPassword(email, password)
    .catch(error => {
      console.log(error)
    });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {

  });

  if (initializing) return null;

  return (
    <ThemeProvider theme={theme}>
      
      { !user ?
      <View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Email."
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setEmail(email)} />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Password."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)} />
          </View><Button type="solid" title="Login" onPress={userLogin} />
      </View>
      :
      <View>
        <Text style={styles.sectionTitle}>
          Welcome {user.email}
        </Text>
        { loadingPosts ?
          <ActivityIndicator/>
          :
          <ScrollView>

          </ScrollView>
        }
      </View>
      }
    </ThemeProvider>);
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
  box: {

  },
  textInput: {

  },
  inputView: {
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
});

export default App;
