import axios from "axios";

const url =
  process.env.NODE_ENV.trim() === "development"
    ? "http://localhost:5000/MyPage"
    : "https://energetic-kit-ox.cyclic.app/MyPage";
const loginUrl =
  process.env.NODE_ENV.trim() === "development"
    ? "http://localhost:5000/Login"
    : "https://energetic-kit-ox.cyclic.app/Login";
const adminUrl =
  process.env.NODE_ENV.trim() === "development"
    ? "http://localhost:5000/Admin"
    : "https://energetic-kit-ox.cyclic.app/Admin";

// retrieve tell sentences
export const fetchTellSentences = () => axios.get(loginUrl);

// retrieve/create/update user sentences on mypage
export const fetchUserSentences = (userInfo) => axios.post(url, userInfo);
export const createSentence = (newSentence) => axios.post(url, newSentence);
export const editUserSentences = (sentences) => axios.post(url, sentences);

// retrieve/log out user info from /Login
export const fetchUser = (userInfo) => axios.post(loginUrl, userInfo);
export const logoutUser = () => axios.post(loginUrl);

// retrieve/update sentences awaiting approval
export const fetchApprovalSentences = () => axios.get(adminUrl);
export const updateApprovalSentences = (sentence) =>
  axios.post(adminUrl, sentence);
