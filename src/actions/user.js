import * as api from "../api";

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
