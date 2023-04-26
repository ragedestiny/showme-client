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
const collectionUrl =
  process.env.NODE_ENV.trim() === "development"
    ? "http://localhost:5000/Collections"
    : "https://energetic-kit-ox.cyclic.app/Collections";

// retrieve tell sentences
export const fetchTellSentences = () => axios.get(loginUrl);

// retrieve/create/update user sentences on mypage
export const fetchUserSentences = (userInfo) => axios.post(url, userInfo);
export const createSentence = (newSentence) => axios.post(url, newSentence);
export const editUserSentences = (sentence) => axios.post(url, sentence);

// retrieve/log out user info from /Login
export const fetchUser = (userInfo) => axios.post(loginUrl, userInfo);
export const logoutUser = () => axios.post(loginUrl);

// retrieve/approve/reject sentences awaiting approval
export const fetchApprovalSentences = () => axios.get(adminUrl);
export const redoSentence = (sentence) => axios.post(adminUrl, sentence);
export const approveSentence = (sentence) => axios.post(adminUrl, sentence);

// retrieve approved sentences
export const fetchApprovedSentences = () => axios.get(collectionUrl);
