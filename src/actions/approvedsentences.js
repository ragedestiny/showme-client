import * as api from "../api";

// action to fetch Approved sentences. Also hands the list back to whoever
// asked (an empty list if the request failed), so they can use it right away.
export const fetchApprovedSentences = () => async (dispatch) => {
  try {
    const { data } = await api.fetchApprovedSentences();

    dispatch({ type: "FETCH_APPROVED", payload: data });
    return data;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
