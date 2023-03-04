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
export const editSentences = (sentences) => async (dispatch) => {
  try {
    const { data } = await api.editUserSentences(sentences);

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
    console.log(error);
  }
};

// Retrieve user info
export const fetchUser = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.fetchUser(userInfo);

    dispatch({ type: "FIND_USER", payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
  try {
    const { data } = await api.logoutUser();

    dispatch({ type: "LOGOUT", payload: data });
  } catch (error) {
    console.log(error);
  }
};
