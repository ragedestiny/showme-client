import axios from "axios";
import Cookies from "js-cookie";

const url =
  process.env.NODE_ENV.trim() === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;

// retrieve tell sentences
export const fetchTellSentences = () => axios.get(`${url}/`);

// Authentication URLs
const authUrl = `${url}/auth/`;
export const loginUser = (token) => axios.post(authUrl, { token });

// retrieve user info from /Login using JWT token in headers
const loginUrl = `${url}/Login`;
export const fetchUser = () => {
  const token = Cookies.get("jwtToken");
  return axios.get(loginUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// retrieve/create/update user sentences on mypage
const mypageURL = `${url}/MyPage`;
export const fetchUserSentences = () => {
  const token = Cookies.get("jwtToken");
  return axios.get(mypageURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const createSentence = (newSentence) => {
  const token = Cookies.get("jwtToken");
  return axios.post(mypageURL, newSentence, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const editUserSentences = (editedSentence) => {
  const token = Cookies.get("jwtToken");
  return axios.patch(mypageURL, editedSentence, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// logout User
const logoutUrl = `${url}/Logout`;
export const logoutUser = () => axios.post(logoutUrl);

// retrieve/approve/reject sentences awaiting approval
const adminUrl = `${url}/Admin`;
export const fetchApprovalSentences = () => {
  const token = Cookies.get("jwtToken");
  return axios.get(adminUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updatePendingApprovalSentences = (status, sentence) => {
  const token = Cookies.get("jwtToken");
  return axios.patch(
    adminUrl,
    { status, sentence },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// retrieve approved sentences
const collectionUrl = `${url}/Collections`;
export const fetchApprovedSentences = () => axios.get(collectionUrl);
