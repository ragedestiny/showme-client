import * as api from "../api";

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
    console.log(data);
    dispatch({ type: "EDIT", payload: data });
    console.log("test");
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
