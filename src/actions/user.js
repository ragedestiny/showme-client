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

// When the app opens, redux-persist restores the last user from the browser's
// storage. That's only a memory of a login, not proof. If we remember someone,
// ask the server whether the login is still valid: a 401 makes the interceptor
// log out; no answer (offline) leaves things as they are.
export const checkSession = () => async (dispatch, getState) => {
  const rememberedUser = getState().user;
  if (Object.keys(rememberedUser).length === 0) return;
  await dispatch(fetchUser());
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
