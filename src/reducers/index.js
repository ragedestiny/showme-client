import { combineReducers } from "redux";
import tellsentences from "./tellsentences";
import usersentences from "./usersentences";
import user from "./user";
import approvalsentences from "./approvalsentences";

// combine reducers for react redux
export default combineReducers({
  tellsentences: tellsentences,
  user: user,
  usersentences: usersentences,
  approvalsentences: approvalsentences,
});
