import * as api from "../api";

// action to fetch Approved sentences
export const fetchApprovedSentences = () => async (dispatch) => {
  try {
    const { data } = await api.fetchApprovedSentences();

    dispatch({ type: "FETCH_APPROVED", payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
