import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import dataReducer from './data_reducer';
import carouselReducer from './carousel_reducer';
import profileReducer from './profile_reducer';
import changedReducer from './changed_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    data: dataReducer,
    carousel: carouselReducer,
    profile: profileReducer,
    changed: changedReducer
});

export default rootReducer;