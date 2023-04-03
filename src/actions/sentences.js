import * as api from "../api";

// Action Creators for React redux

// Retrieve tell sentences
export const getTellSentences = () => async (dispatch) => {
  try {
    const { data } = await api.fetchTellSentences();

    dispatch({ type: "FETCH_TELL", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// Retrieve user sentences
export const getUserSentences = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.fetchUserSentences(userInfo);

    dispatch({ type: "FETCH_ALL", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// update edited sentences
export const editSentences = (sentence) => async (dispatch) => {
  try {
    const { data } = await api.editUserSentences(sentence);

    dispatch({ type: "EDIT", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// Create new sentences
export const createSentence = (sentence) => async (dispatch) => {
  try {
    const { data } = await api.createSentence(sentence);

    dispatch({ type: "CREATE", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// Retrieve user info
export const fetchUser = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.fetchUser(userInfo);

    dispatch({ type: "FIND_USER", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
  try {
    const { data } = await api.logoutUser();

    dispatch({ type: "LOGOUT", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// fetch Sentences Awaiting Approval
export const fetchApprovalSentences = () => async (dispatch) => {
  try {
    const { data } = await api.fetchApprovalSentences();

    dispatch({ type: "FETCH_APPROVAL", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// post request when sentence is approved, update database
export const approveSentence = (sentence) => async (dispatch) => {
  try {
    const { data } = await api.approveSentence(sentence);

    dispatch({ type: "APPROVE", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

// post request when sentence is rejected and need redo, update database
export const redoSentence = (sentence) => async (dispatch) => {
  try {
    const { data } = await api.redoSentence(sentence);

    dispatch({ type: "REDO", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
