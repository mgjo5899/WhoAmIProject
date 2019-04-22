const initState = {
    new: [],
    images: [],
    existing: [],
    delete: [],
    selected: []
}

const dataReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RESET_DATA':
            return initState;
        case 'SET_DATA':
            return {
                ...state,
                ...action.data
            }
        default:
            return state;
    }
}

export default dataReducer;