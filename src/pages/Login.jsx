import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Home from "./Home";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { fetchUser } from "../actions/user";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function Login({ show, onHide }) {
  // dispatch for react redux
  const dispatch = useDispatch();

  // navigate from react router
  const navigate = useNavigate();

  // state to show login modal
  const [loading, setLoading] = useState(false);

  // callback when connecting to google identity services
  function handleCallbackResponse(response) {
    // load spinner
    setLoading(true);

    // grab credential from jwt token
    const userObject = jwtDecode(response.credential);

    // send credential to backend to create or login user
    dispatch(fetchUser(userObject)).then(() => {
      // auto close login modal
      onHide();
      // hide loading spinner
      setLoading(false);

      navigate("/MyPage");
    });
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
