const initState = {}

const changeReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RESET_CHANGED':
            return initState;
        case 'SET_CHANGED':
            return {
                ...state,
                ...action.changed
            }
        case 'SET_CHANGED_CALLBACK':
            return {
                ...state,
                ...action.changed(state)
            }
        default:
            return state;
    }
}

export default changeReducer;