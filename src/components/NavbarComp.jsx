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
import { useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay-ts";
import useAuthService from "../service/authService";

function NavbarComp() {
  // get user from global react redux store
  const user = useSelector((state) => state.user);

  // navigate to different pages with react
  const authService = useAuthService();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Function to handle showing the login modal
  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  // Function to handle hiding the login modal
  const handleHideLoginModal = () => {
    setShowLoginModal(false);
  };

  // Function to handle collapsing the Navbar
  const handleNavCollapse = () => setExpanded(false);

  // Use authService hook to sign in or out
  const signInorOut = async () => {
    await authService(
      user,
      setLoading,
      handleShowLoginModal,
      handleNavCollapse
    );
  };

  // React bootstrap Navbar and different routes for different parts of the website
  return (
    <>
      <LoadingOverlay active={loading} spinner text="Logging out...">
        <div>
          <Navbar
            variant="light"
            style={{ backgroundColor: "#e3f2fd" }}
            expand="sm"
            expanded={expanded}
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
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                onClick={() => setExpanded(expanded ? false : "expanded")}
              />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link
                    as={Link}
                    to={"/admin"}
                    hidden={!user.isAdmin}
                    onClick={handleNavCollapse}
                  >
                    Admin
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={"/Collections"}
                    onClick={handleNavCollapse}
                  >
                    Collections
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={"/MyPage"}
                    hidden={Object.keys(user).length === 0 ? true : false}
                    onClick={handleNavCollapse}
                  >
                    {user ? `${user.firstName}'s Page` : ""}
                  </Nav.Link>
                  <Nav.Link onClick={signInorOut}>
                    {Object.keys(user).length !== 0 ? "Logout" : "Login"}
                  </Nav.Link>
                  <Nav.Link as={Link} to={"/about"} onClick={handleNavCollapse}>
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
