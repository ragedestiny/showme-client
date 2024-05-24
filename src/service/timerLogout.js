import { useDispatch } from "react-redux";
import { logoutUser } from "../actions/user";
import { clearAllSentences } from "../actions/usersentences";
import { useNavigate } from "react-router-dom";

const useTimerLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startTimer = () => {
    const interval = setInterval(() => {
      dispatch(logoutUser());
      dispatch(clearAllSentences());
      navigate("/");
      clearInterval(interval);
    }, 30 * 60 * 1000); // 30 minutes
  };

  return startTimer;
};

export default useTimerLogout;
