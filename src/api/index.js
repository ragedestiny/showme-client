import axios from "axios";

// Every request goes to /api on this same site. A proxy forwards it to the
// backend: src/setupProxy.js during `npm start`, public/_redirects on Netlify.
// Because the browser only ever talks to this site, it automatically sends the
// httpOnly login cookie with each request; no code here touches the token.
export const API = axios.create({ baseURL: "/api" });

// retrieve tell sentences
export const fetchTellSentences = () => API.get("/");

// exchange the Google ID token for our login cookie
export const loginUser = (token) => API.post("/auth", { token });

// retrieve the signed-in user's info
export const fetchUser = () => API.get("/Login");

// retrieve/create/update user sentences on mypage
export const fetchUserSentences = () => API.get("/MyPage");
export const createSentence = (newSentence) => API.post("/MyPage", newSentence);
export const editUserSentences = (editedSentence) =>
  API.patch("/MyPage", editedSentence);

// logout User
export const logoutUser = () => API.post("/Logout");

// retrieve/approve/reject sentences awaiting approval
export const fetchApprovalSentences = () => API.get("/Admin");
export const updatePendingApprovalSentences = (status, sentence) =>
  API.patch("/Admin", { status, sentence });

// retrieve approved sentences
export const fetchApprovedSentences = () => API.get("/Collections");
