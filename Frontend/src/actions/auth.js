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


// axios.post('http://localhost:5000/signin', 
// {
//     username:this.state.username, 
//     password:this.state.password
// })
//     .then(function (response) {
//
//     console.log(response);
//     if(response.data.status === "Successful"){
//         console.log("Login successfull");
//         this.setState({loggedOn:true})
//     }
//
//     else{
//         console.log("There is no user with the given username and password");
//         //alert("Username does not exist");
//     }
//     }
// )
// .catch(function (error) {
//
// console.log(error);
// });

export const doLogin = (username, password) => {
    console.log('READ THE DOCS. IT IS VERY HELPFUL TO READ THE DOCS.');
    console.log(username, password);
    return {
        type: 'types.AUTH_LOGIN'
    };
};

export const doLogout = () => dispatch => {
  dispatch(userLogout());
};
