import axios from "axios";

const url = "http://localhost:5000/MyPage";
const loginUrl = "http://localhost:5000/Login";

// retrieve tell sentences
export const fetchTellSentences = () => axios.get(loginUrl);

// retrieve/create/update user sentences on mypage
export const fetchUserSentences = (userInfo) => axios.post(url, userInfo);
export const createSentence = (newSentence) => axios.post(url, newSentence);
export const editUserSentences = (sentences) => axios.post(url, sentences);

// retrieve/log out user info from /Login
export const fetchUser = (userInfo) => axios.post(loginUrl, userInfo);
export const logoutUser = () => axios.post(loginUrl);
