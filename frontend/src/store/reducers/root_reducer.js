import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import dataReducer from './data_reducer';
import carouselReducer from './carousel_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    data: dataReducer,
    carousel: carouselReducer
});

export default rootReducer;