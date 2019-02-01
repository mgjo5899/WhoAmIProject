const initState = {
    loaded: false,
    signedIn: false,
    user: {
        email: '',
        username: '',
        registered_on: 0,
        confirmed: false
    },
    errorMsg: {
        signIn: '',
        signUp: ''
    }
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case 'STORE_USER':
            return {
                ...state,
                signedIn: true,
                user: action.user
            }
        case 'CONFIRM_USER':
            return {
                ...state,
                loaded: true
            }
        case 'SIGNIN_ERR':
            return {
                ...state,
                errorMsg: {
                    signIn: action.errorMsg
                }
            }
        case 'SIGNUP_ERR':
            return {
                ...state,
                errorMsg: {
                    signUp: action.errorMsg
                }
            }
        case 'SIGNOUT_USER':
            return {
                ...initState,
                loaded: true
            }
        default:
            return state;
    }
}

export default authReducer;