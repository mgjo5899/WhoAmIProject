import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import ReduxThunk from "redux-thunk";

const middlewares = [ReduxThunk];
const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
