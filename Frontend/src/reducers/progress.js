import * as types from "../actions/types";

const initialState = 0;

const progressReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INCREMENT_PROGRESS:
      return state + 1;
    case types.DECREMENT_PROGRESS:
      return Math.max(state - 1, 0);
    default:
      return state;
  }
};

export default progressReducer;