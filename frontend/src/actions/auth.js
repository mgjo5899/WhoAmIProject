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


export const doLogin = (username, password) => {
    return dispatch => {
        axios.post('http://localhost:5000/signin', {
            username: username,
            password: password
        })
            .then((response)=>{
                dispatch({
                    type: types.AUTH_LOGIN,
                    username: response.username
                })
            })
            .catch((error)=>{
                console.log("There is no user with the given username and password");
                //alert("Username does not exist");
            })
    };
};

export const doLogout = () => ({
  type: types.AUTH_LOGOUT,
});


