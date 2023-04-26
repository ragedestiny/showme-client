import { combineReducers } from "redux";
import tellsentences from "./tellsentences";
import usersentences from "./usersentences";
import user from "./user";
import approvalsentences from "./approvalsentences";
import approvedsentences from "./approvedsentences";

// combine reducers for react redux
export default combineReducers({
  tellsentences,
  user,
  usersentences,
  approvalsentences,
  approvedsentences,
});
