import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import dataReducer from './data_reducer';
import carouselReducer from './carousel_reducer';
import profileReducer from './profile_reducer';
import changeReducer from './change_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    data: dataReducer,
    carousel: carouselReducer,
    profile: profileReducer,
    change: changeReducer
});

export default rootReducer;