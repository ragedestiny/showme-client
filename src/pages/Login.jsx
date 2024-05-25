import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { fetchUser } from "../actions/user";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Cookies from "js-cookie";
import { loginUser } from "../api";
import useTimerLogout from "../service/timerLogout";

function Login({ show, onHide }) {
  // dispatch for react redux
  const dispatch = useDispatch();

  // navigate from react router
  const navigate = useNavigate();

  // state to show login modal
  const [loading, setLoading] = useState(false);
  const startTimer = useTimerLogout();

  // callback when connecting to google identity services
  async function handleCallbackResponse(response) {
    setLoading(true);

    try {
      const token = response.credential;
      console.log(token);
      const res = await loginUser(token);
      Cookies.set("jwtToken", res.data.token, { expires: 1 / 48 }); // Expires in 30 minutes
      startTimer();
      await dispatch(fetchUser());
      onHide();
      setLoading(false);
      navigate("/MyPage");
    } catch (error) {
      console.error("Authentication error", error);
      setLoading(false);
      // Handle authentication error
    }
  }

  useEffect(() => {
    // setup for Google identity servive
    /* global google */
    setTimeout(() => {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleCallbackResponse,
      });
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
      google.accounts.id.prompt();
    }, 300);
  }, []);

  // login modal with React and google identity service
  return (
    <>
      {/* <Home /> */}

      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Sign in with Google</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="spinner">
              <LoadingSpinner />
            </div>
          ) : (
            <div id="signInDiv"></div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;
