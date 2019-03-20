const initState = {
    user: {
        email: '',
        username: '',
        confirmed_on: 0,
        confirmed: false
    }
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case 'STORE_USER':
            return {
                ...state,
                user: action.user
            }
        case 'SIGNOUT_USER':
            return {
                ...initState,
            }
        default:
            return state;
    }
}

export default authReducer;