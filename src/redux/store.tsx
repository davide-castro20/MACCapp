import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import newPost from './newPost';
import dynamicMode from './dynamicMode';


const rootReducer = combineReducers(
    { user, newPost, dynamicMode }
);

const buildStore = () => {
    return configureStore({
        reducer: 
            rootReducer
    
        
    });
}
export default buildStore;