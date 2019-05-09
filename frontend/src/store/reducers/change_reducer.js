const initState = {
    changed: []
}

const changeReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RESET_CHANGED':
            return initState;
        case 'SET_CHANGED':
            return {
                ...state,
                changed: [...state.changed]
            };
        default:
            return state;
    }
}

export default changeReducer;