const initState = {
    profile_image_url: '',
    bio: '',
    company: '',
    location: '',
    website: '',
    include_email: true
}

const dataReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RESET_PROFILE':
            return initState;
        case 'SET_PROFILE':
            return {
                ...state,
                ...action.profile
            }
        default:
            return state;
    }
}

export default dataReducer;