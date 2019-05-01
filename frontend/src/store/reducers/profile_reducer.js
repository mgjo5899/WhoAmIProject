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
            console.log('haha')
            return initState;
        case 'SET_DATA':
            return {
                ...state,
                ...action.data
            }
        case 'SHOW_IMAGES':
            return {
                ...state,
                images: action.images
            }
        default:
            return state;
    }
}

export default dataReducer;