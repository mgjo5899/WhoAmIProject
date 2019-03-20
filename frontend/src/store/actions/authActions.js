import axios from 'axios';
import { SERVER } from '../../config';

export const storeUser = user => {
    return dispatch => {
        dispatch({ type: 'STORE_USER', user });
    }
}

export const signOut = () => {
    return dispatch => {
        axios.get(SERVER + '/signout')
            .then(() => {
                dispatch({ type: 'SIGNOUT_USER' });
            }).catch(err => {
                console.log(err);
            });
    }
}