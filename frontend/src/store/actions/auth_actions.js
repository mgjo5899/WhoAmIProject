import axios from 'axios';
import { SERVER } from '../../config';

export const storeUser = user => {
    return dispatch => {
        dispatch({ type: 'STORE_USER', user });
    }
}

export const signOut = history => {
    console.log(history);
    return dispatch => {
        axios.get(SERVER + '/signout')
            .then(() => {
                dispatch({ type: 'SIGNOUT_USER' });
                // succeed, so redirecting to home
                history.push('/');
            }).catch(err => {
                console.log(err);
            });
    }
}

export const resetData = () => ({
    type: 'RESET_DATA'
})