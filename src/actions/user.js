import * as api from "../api";

// Retrieve user info
export const fetchUser = () => async (dispatch) => {
  try {
    const { data } = await api.fetchUser();
    dispatch({ type: "FIND_USER", payload: data });
  } catch (error) {
    console.error(error.message);
  }
};

// Logout User. The backend cancels the login and deletes the httpOnly cookie
// (JavaScript can't). Whatever happens, forget the user on screen too.
export const logoutUser = () => async (dispatch) => {
  try {
    await api.logoutUser();
  } catch (error) {
    console.error(error.message);
  } finally {
    dispatch({ type: "LOGOUT" });
  }
};
