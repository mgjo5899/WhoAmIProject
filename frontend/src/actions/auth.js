import * as types from "./types";
import axios from 'axios';

export const registerUser = (username, email, password) => {
    return dispatch => {
        axios('http://localhost:8000/register', {
            method: "post",
            withCredentials: true,
            data: {
                username: username,
                email: email,
                password: password
            }
        })
            .then((response)=>{
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
        axios('http://localhost:8000/signin', {
            method: "post",
            withCredentials: true,
            data: {
                email: email,
                password: password
            }
        })
            .then((response)=>{
                if (response.data.status === true) {
                    dispatch({
                        type: types.AUTH_LOGIN,
                        username: response.data.username,
                        email: email,
                        confirmed: response.data.confirmed,
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


