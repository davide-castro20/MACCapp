import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
} from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon, Switch, useThemeMode, ThemeMode, Divider, useTheme, Button } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import PostItem from '../components/PostItem';


import styles from '../../src/styles/style';
import { useSelector, useDispatch } from 'react-redux';

import { enableDynamicMode, disableDynamicMode, resetDynamicMode } from '../redux/dynamicMode';

import createUserMenuStyles from '../styles/userMenu';

import { unsetUser } from '../redux/user';


const EditProfileScreen = (props: any) => {
    
}

export default EditProfileScreen;