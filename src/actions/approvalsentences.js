import * as api from "../api";

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
