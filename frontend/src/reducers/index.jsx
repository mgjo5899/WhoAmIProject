import { combineReducers } from "redux";
import authReducer from "./auth";
import progressReducer from "./progress";

const rootReducer = combineReducers({
  auth: authReducer,
  progress: progressReducer
});

export default rootReducer;
