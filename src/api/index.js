import axios from "axios";

const url =
  process.env.NODE_ENV.trim() === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;

// retrieve tell sentences
const loginUrl = url + "Login";
export const fetchTellSentences = () => axios.get(loginUrl);

// retrieve/create/update user sentences on mypage
const mypageURL = url + "MyPage";
export const fetchUserSentences = (userInfo) => axios.post(mypageURL, userInfo);
export const createSentence = (newSentence) =>
  axios.post(mypageURL, newSentence);
export const editUserSentences = (sentence) => axios.put(mypageURL, sentence);

// retrieve/log out user info from /Login
export const fetchUser = (userInfo) => axios.post(loginUrl, userInfo);
export const logoutUser = () => axios.post(loginUrl);

// retrieve/approve/reject sentences awaiting approval
const adminUrl = url + "Admin";
export const fetchApprovalSentences = () => axios.get(adminUrl);
export const redoSentence = (sentence) => axios.patch(adminUrl, sentence);
export const approveSentence = (sentence) => axios.patch(adminUrl, sentence);

// retrieve approved sentences
const collectionUrl = url + "Collections";
export const fetchApprovedSentences = () => axios.get(collectionUrl);
