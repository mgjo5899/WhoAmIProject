const initState = {
    signedIn:false,
    verified:false,
    user: {
        email:'',
        username:'',
        registeredOn:0
    }
}

const authReducer = (state = initState, action) => {
    return state;
}

export default authReducer;