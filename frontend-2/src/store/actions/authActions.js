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
            const { status, message } = res.data;
            if (status) {
                dispatch(checkSignedIn());
                dispatch(throwError('SIGNIN_ERR', ''));
            } else {
                dispatch(throwError('SIGNIN_ERR', message));
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
                const { status, email } = res.data;
                status ?
                    getSpecificUser(email).then(user => {
                        dispatch(storeUser(user));
                    }) :
                    dispatch(confirmed());
            }).catch(err => {
                console.log(err);
            });
    }
}

const getSpecificUser = email =>
    axios.get(SERVER + '/users')
        .then(res => {
            const { status, users } = res.data;
            if (status) {
                return users.find(user => user.email === email);
            } else {
                console.log('status wrong', res);
            }
        }).catch(err => {
            console.log(err);
        });

export const registerUser = userInfo => {
    return dispatch => {
        axios.post(SERVER + '/register', userInfo)
            .then(res => {
                const { status } = res.data;
                if (status) {
                    const { email, password } = userInfo;
                    dispatch(signIn(email, password));
                } else {
                    throwError('SIGNUP_ERROR', 'Email already exists')
                }
            }).catch(err => {
                console.log(err);
            });
    }
}