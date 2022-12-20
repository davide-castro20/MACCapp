import { createSlice } from '@reduxjs/toolkit'

// Slice
const newPostSlice = createSlice({
    name: 'newPost',
    initialState: {
        image: null,
        imagePreview: null,
        labels: null,
        faces: null,
    },
    reducers: {
        imageAdded: (state, action) => {
            state.image = action.payload.image;
        },
        imagePreview: (state, action) => {
            state.imagePreview = action.payload.preview;
        },
        labelsAdded: (state, action) => {
            	
            if (state.labels != null) {
                for (let label of action.payload.labels) {
                    if (!(state.labels.includes(label)))
                        state.labels = [...state.labels, label];
                }
            } else 
                state.labels = action.payload.labels;
        },
        labelRemoved: (state, action) => {
            if (state.labels != null) {
                let index = state.labels.indexOf(action.payload.label);
                if (index > -1) {
                    state.labels.splice(index, 1);
                }
            }
        },
        facesAdded: (state, action) => {
            state.faces = action.payload.faces;
        },
        reset: (state) => {
            state.image = null;
            state.imagePreview = null;
            state.labels = null;
            state.faces = null;
        },
    },
});
export default newPostSlice.reducer

// Actions
const { imageAdded, imagePreview, labelsAdded, labelRemoved, facesAdded, reset } = newPostSlice.actions;

export const setNewImage = ( image ) => async dispatch => {
    try {
        dispatch(imageAdded({ image }));
    } catch (e) {
        return console.error(e.message);
    }
}

export const setImagePreview = ( preview ) => async dispatch => {
    try {
        dispatch(imagePreview({ preview }));
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

export const removeLabel = ( label ) => async dispatch => {
    try {
        dispatch(labelRemoved({ label }));
    } catch (e) {
        return console.error(e.message);
    }
}

export const setNewFaces = ( faces ) => async dispatch => {
    try {
        dispatch(facesAdded({ faces }));
    } catch (e) {
        return console.error(e.message);
    }
}

export const resetNewPost = () => async dispatch => {
    try {
        dispatch(reset());
    } catch (e) {
        return console.error(e.message);
    }
}