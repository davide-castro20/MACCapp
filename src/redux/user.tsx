import { createSlice } from '@reduxjs/toolkit'

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        userData: null,
    },
    reducers: {
        loginSucess: (state, action) => {
            state.user = action.payload.user;
        },
        userDataSucess: (state, action) => {
            state.userData = action.payload.userData;
        },
        logoutSuccess: (state) => {
            state.userData = null;
            state.user = null;
        },
    },
});
export default userSlice.reducer

// Actions
const { loginSucess, userDataSucess, logoutSuccess } = userSlice.actions;

export const setUser = ( user ) => async dispatch => {
    try {
        dispatch(loginSucess({ user }));
    } catch (e) {
        return console.error(e.message);
    }
}

export const setUserData = ( userData ) => async dispatch => {
    try {
        dispatch(userDataSucess({ userData }));
    } catch (e) {
        return console.error(e.message);
    }
}

export const unsetUser = () => async dispatch => {
    try {
        // const res = await api.post('/api/auth/logout/')
        return dispatch(logoutSuccess())
    } catch (e) {
        return console.error(e.message);
    }
}