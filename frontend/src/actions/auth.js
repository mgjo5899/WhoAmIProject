import * as types from "./types";
import axios from 'axios';
import { incrementProgress, decrementProgress } from "./progress";


const userLogin = username => ({
  type: types.AUTH_LOGIN,
  username,
});

const userLogout = () => ({
  type: types.AUTH_LOGOUT,
});

const fakeLoginRequest = (username, password) => {
    alert(username, password)
}


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
                        username: response.data.username
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


