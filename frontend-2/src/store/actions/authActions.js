import axios from 'axios';

const SERVER = 'http://localhost:8000';

export const storeUser = user => {
    return dispatch => {
        dispatch({ type: 'STORE_USER', user });
        dispatch(confirmed());
    }
}

export const confirmed = () => {
    return dispatch => {
        dispatch({ type: 'CONFIRM_USER' });
    }
}

export const throwError = (type, errorMsg) => ({
    type,
    errorMsg
})

export const signIn = (email, password) => {
    return dispatch => {
        axios.post(SERVER + '/signin', {
            email,
            password
        }).then(res => {
            const { status, user } = res.data;
            if (status) {
                dispatch(storeUser(user));
                dispatch(throwError('SIGNIN_ERR', ''));
            } else {
                dispatch(throwError('SIGNIN_ERR', 'Could not sign in'));
            }
        }).catch(err => {
            console.log(err);
        });
    }
}

export const checkSignedIn = () => {
    return dispatch => {
        axios.get(SERVER + '/signin')
            .then(res => {
                const { status, user } = res.data;
                status ?
                    dispatch(storeUser(user))
                    :
                    dispatch(confirmed());
            }).catch(err => {
                console.log(err);
            });
    }
}

export const registerUser = userInfo => {
    return dispatch => {
        axios.post(SERVER + '/register', userInfo)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    const { email, password } = userInfo;
                    dispatch(signIn(email, password));
                } else {
                    dispatch(throwError('SIGNUP_ERR', message));
                }
            }).catch(err => {
                console.log(err);
            });
    }
}

export const signOut = () => {
    return dispatch => {
        axios.get(SERVER + '/signout')
            .then(() => {
                dispatch({ type: 'SIGNOUT_USER' });
                dispatch(confirmed());
            }).catch(err => {
                console.log(err);
            });
    }
}