import { createSlice } from '@reduxjs/toolkit'

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.userData = action.payload.userData;
        },
        logoutSuccess: (state, action) => {
            state.userData = null;
        },
    },
});
export default userSlice.reducer

// Actions
const { loginSuccess, logoutSuccess } = userSlice.actions
export const setUserData = ( userData ) => async dispatch => {
    try {
        dispatch(loginSuccess({ userData }));
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