import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { fetchUser } from "../actions/user";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { loginUser } from "../api";

function Login({ show, onHide }) {
  // dispatch for react redux
  const dispatch = useDispatch();

  // navigate from react router
  const navigate = useNavigate();

  // state to show login modal
  const [loading, setLoading] = useState(false);

  // callback when connecting to google identity services
  async function handleCallbackResponse(response) {
    setLoading(true);

    try {
      // Send Google's ID token to our backend. If it's valid, the backend's
      // reply sets the httpOnly login cookie; the browser stores it for us.
      await loginUser(response.credential);
      // Fetching the user also proves the cookie works end to end.
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
