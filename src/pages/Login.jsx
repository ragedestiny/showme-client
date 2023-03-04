import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Home from "./Home";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../actions/sentences";
import { useNavigate } from "react-router-dom";

function Login() {
  // dispatch for react redux
  const dispatch = useDispatch();

  // navigate from react router
  const navigate = useNavigate();

  // state to show login modal
  const [show, setShow] = useState(true);

  // handle closing the modal
  const handleClose = () => setShow(false);

  // callback when connecting to google identity services
  function handleCallbackResponse(response) {
    // grab credential from jwt token
    const userObject = jwtDecode(response.credential);

    // send credential to backend to create or login user
    dispatch(fetchUser(userObject));

    // auto close login modal
    setShow(false);

    // redirect to My Page
    setTimeout(() => {
      navigate("/MyPage");
    }, 700);
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
    }, 300);
  }, []);

  // login modal with React and google identity service
  return (
    <>
      <Home />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign in with Google</Modal.Title>
        </Modal.Header>
        <div id="signInDiv"></div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;
