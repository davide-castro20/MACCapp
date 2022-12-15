import { createSlice } from '@reduxjs/toolkit'

// Slice
const newPostSlice = createSlice({
    name: 'newPost',
    initialState: {
        image: null,
        labels: null,
        faces: null
    },
    reducers: {
        imageAdded: (state, action) => {
            state.image = action.payload.image;
        },
        labelsAdded: (state, action) => {
            state.labels = action.payload.labels;
        },
        facesAdded: (state, action) => {
            state.faces = action.payload.faces;
        },
    },
});
export default newPostSlice.reducer

// Actions
const { imageAdded, labelsAdded, facesAdded } = newPostSlice.actions;

export const setNewImage = ( image ) => async dispatch => {
    try {
        dispatch(imageAdded({ image }));
    } catch (e) {
        return console.error(e.message);
    }
}

export const setNewLabels = ( labels ) => async dispatch => {
    try {
        dispatch(labelsAdded({ labels }));
    } catch (e) {
        return console.error(e.message);
    }
}

export const setNewFaces = ( faces ) => async dispatch => {
    try {
        dispatch(facesAdded(faces));
    } catch (e) {
        return console.error(e.message);
    }
}