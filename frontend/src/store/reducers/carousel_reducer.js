const initState = {
    dashboardActiveIndex: 0,
    profileActiveIndex: 0
}

const activeIndexFlagMap = {
    DASHBOARD: {
        indexType: 'dashboardActiveIndex',
        indexSize: 4
    },
    PROFILE: {
        indexType: 'profileActiveIndex',
        indexSize: 4
    }
}

const moveIndex = (state, action, flag) => {
    const operator = flag ? 1 : -1;
    const activeIndexFlag = action.activeIndexFlag;
    const indexType = activeIndexFlagMap[activeIndexFlag].indexType;
    const activeIndex = state[indexType];
    return {
        ...state,
        [indexType]: (((activeIndex + operator) % activeIndexFlagMap[activeIndexFlag].indexSize) + activeIndexFlagMap[activeIndexFlag].indexSize) % activeIndexFlagMap[activeIndexFlag].indexSize
    }
}

const CarouselReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RESET_INDEX':
            return {
                ...state,
                [activeIndexFlagMap[action.activeIndexFlag].indexType]: 0
            };
        case 'NEXT':
            return moveIndex(state, action, true);
        case 'PREVIOUS':
            return moveIndex(state, action, false);
        default:
            return state;
    }
}

export default CarouselReducer;