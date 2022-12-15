import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { ListItem, Avatar, SpeedDial, Icon, Switch, useThemeMode, ThemeMode } from '@rneui/themed'

import React, { useState, useEffect, useCallback } from 'react';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import styles from '../../src/styles/style';
import { useSelector, useDispatch } from 'react-redux';

import { enableDynamicMode, disableDynamicMode } from '../redux/dynamicMode';

const UserMenuScreen = () => {

    const { mode, setMode } = useThemeMode();

    const dynamicMode = useSelector(state => state.dynamicMode.enabled);

    const dispatch = useDispatch();

    return (

        <View style={{ flex: 1 }}>
            {/* {
                loadingPosts ? (
                    <ActivityIndicator />
                ) : (
                    // <ScrollView>
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={posts}
                        renderItem={renderPost}
                        refreshControl={
                            <RefreshControl
                                refreshing={loadingPosts}
                                onRefresh={refreshPosts}
                                title="Pull to refresh" />
                        }
                    />
                )
                // </ScrollView>
            } */}

            <Switch
                onValueChange={() => {
                    let newMode: ThemeMode;

                    if (mode == 'light') {
                        newMode = 'dark';
                    }
                    else {
                        newMode = 'light';
                    }

                    setMode(newMode);

                }}
                value={mode == 'dark'}
                disabled={dynamicMode}
            />

            <Switch
                onValueChange={() => {
                    dynamicMode ? dispatch(disableDynamicMode()) : dispatch(enableDynamicMode());
                }}
                value={dynamicMode}
            />

        </View>

    );
}

export default UserMenuScreen;