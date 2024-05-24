import * as api from "../api";
import Cookies from "js-cookie";

// Retrieve user info
export const fetchUser = () => async (dispatch) => {
  try {
    const { data } = await api.fetchUser();
    dispatch({ type: "FIND_USER", payload: data });
  } catch (error) {
    console.error(error.message);
  }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
  try {
    await api.logoutUser();
    Cookies.remove("jwtToken");
    dispatch({ type: "LOGOUT" });
  } catch (error) {
    console.error(error.message);
  }
};
