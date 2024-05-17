import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Routes, Route, Link } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";
import Admin from "../pages/Admin";
import Collection from "../pages/Collection";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../actions/user";
import LoadingOverlay from "react-loading-overlay-ts";

function NavbarComp() {
  // get user from global react redux store
  const user = useSelector((state) => state.user);

  // navigate to different pages with react
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to handle showing the login modal
  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  // Function to handle hiding the login modal
  const handleHideLoginModal = () => {
    setShowLoginModal(false);
  };

  // on click, sign out user when there is a user signed in
  async function signInorOut() {
    try {
      // sign out user if there is one signed in
      if (user.length !== 0) {
        setLoading(true); // Start loading
        await dispatch(logoutUser());
        setLoading(false); // Stop loading
        // Navigate to homepage once logged out
        navigate("/");
      } else if (user.length === 0) {
        // Show login modal if no user is currently logged in
        handleShowLoginModal();
      }
    } catch (error) {
      setLoading(false); // Stop loading in case of error
      // Handle any logout errors here
      console.error("Logout failed:", error);
    }
  }

  // React bootstrap Navbar and different routes for different parts of the website
  return (
    <>
      <LoadingOverlay active={loading} spinner text="Logging out...">
        <div>
          <Navbar
            variant="light"
            style={{ backgroundColor: "#e3f2fd" }}
            expand="sm"
          >
            <Container>
              <Navbar.Brand as={Link} to={"/"}>
                <img
                  src={"showme.jpg"}
                  alt="Show ME"
                  height="35"
                  loading="lazy"
                  className="d-inline-block align-top"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link
                    as={Link}
                    to={"/Admin"}
                    hidden={
                      user.id !== process.env.REACT_APP_ADMIN_ID ? true : false
                    }
                  >
                    Admin
                  </Nav.Link>
                  <Nav.Link as={Link} to={"/Collections"}>
                    Collections
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={"/MyPage"}
                    hidden={user.length === 0 ? true : false}
                  >
                    {user.length === 0 ? `` : `${user.firstName}'s Page`}
                  </Nav.Link>
                  <Nav.Link onClick={signInorOut}>
                    {user.length === 0 ? "Login" : "Logout"}
                  </Nav.Link>
                  <Nav.Link as={Link} to={"/about"}>
                    About
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/collections" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/MyPage" element={<MyPage />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        {/* Conditionally render the LoginModal */}
        {showLoginModal && (
          <Login show={showLoginModal} onHide={handleHideLoginModal} />
        )}
      </LoadingOverlay>
    </>
  );
}

export default React.memo(NavbarComp);
