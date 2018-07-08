import * as types from "./types";
import axios from 'axios';

export const registerUser = (username, email, password) => {
    return dispatch => {
        axios.post('http://localhost:8000/users', {
            username: username,
            email: email,
            password: password
        })
            .then((response)=>{
                console.log('reg response', response)
                if (response.data.status === true) {
                    dispatch({
                        type: types.AUTH_REGISTER,
                        username: username, // TODO: need to change to response.data.username,
                        email: email   
                    })
                } else {
                    dispatch({
                        type: types.AUTH_REGISTER,
                        statusMessage: response.data.message
                    })
                    console.log(response.data.message);
                }
            })
            .catch((error)=>{
                console.log("There is no user with the given username and password");
            })
    };
};

export const doLogin = (email, password) => {
    return dispatch => {
        axios.post('http://localhost:8000/signin', {
            email: email,
            password: password
        })
            .then((response)=>{
                if (response.data.status === true) {
                    dispatch({
                        type: types.AUTH_LOGIN,
                        username: response.data.username,
                        email: email,
                    })
                } else {
                    console.log(response.data.message);
                }
            })
            .catch((error)=>{
                console.log("There is no user with the given username and password");
            })
    };
};

export const doLogout = () => ({
  type: types.AUTH_LOGOUT,
});


