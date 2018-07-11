import * as types from "../actions/types";

// Reducer: Get prevState and action and return a new state

const initialState = {
  username: "",
  email: "",
  isLoggedIn: false,
  isConfirmed: false,
  statusMessage: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_LOGIN:
      return {
        ...state, // Preserve states that are unchanged
        username: action.username, // Values to be changed,
        email: action.email,
        isLoggedIn: true,
        isConfirmed: action.confirmed,
      };
    case types.AUTH_LOGOUT:
      return initialState;
    case types.AUTH_REGISTER:
      return {
        ...state,
        username: action.username,
        email: action.email,
        isLoggedIn: true,
        statusMessage: action.statusMessage,
      }
    default:
      return state;
  }
};

export default authReducer;
