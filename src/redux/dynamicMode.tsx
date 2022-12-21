import { createSlice } from '@reduxjs/toolkit'

// Slice
const dynamicModeSlice = createSlice({
    name: 'dynamicMode',
    initialState: {
        enabled: false,
    },
    reducers: {
        enable: (state) => {
            state.enabled = true;
        },
        disable: (state) => {
            state.enabled = false;
        },
        reset: (state) => {
            state.enabled = false;
        }
    },
});
export default dynamicModeSlice.reducer

// Actions
const { enable, disable, reset } = dynamicModeSlice.actions;

export const enableDynamicMode = () => async dispatch => {
    try {
        dispatch(enable());
    } catch (e) {
        return console.error(e.message);
    }
}

export const disableDynamicMode = () => async dispatch => {
    try {
        dispatch(disable());
    } catch (e) {
        return console.error(e.message);
    }
}

export const resetDynamicMode = () => async dispatch => {
    try {
        dispatch(reset());
    } catch (e) {
        return console.error(e.message);
    }
}