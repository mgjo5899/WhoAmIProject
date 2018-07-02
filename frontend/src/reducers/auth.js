import * as types from "../actions/types";

// Reducer: Get prevState and action and return a new state

const initialState = {
  username: "",
  isLoggedIn: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_LOGIN:
      return {
        ...state, // Preserve states that are unchanged
        username: action.username, // Values to be changed
        isLoggedIn: true
      };
    case types.AUTH_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
