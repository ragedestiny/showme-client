import React, { lazy, Suspense, useCallback, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";
import { Routes, Route, Link, useLocation } from "react-router";
import Home from "../pages/Home";
import PageErrorBoundary from "./PageErrorBoundary";
import { useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay-ts";
import useAuthService from "../service/authService";

// Home is the first page most visitors see, so it ships with the main file.
// Every other page is downloaded only when someone first opens it, so the
// home page doesn't wait for code (like MUI for Collections) it never uses.
const About = lazy(() => import("../pages/About"));
const Login = lazy(() => import("../pages/Login"));
const MyPage = lazy(() => import("../pages/MyPage"));
const Admin = lazy(() => import("../pages/Admin"));
const Collection = lazy(() => import("../pages/Collection"));

// Shown for the moment a page's code is still downloading
const PageLoading = () => (
  <div className="d-flex justify-content-center my-5">
    <Spinner animation="border" role="status" aria-label="Loading page" />
  </div>
);

function NavbarComp() {
  // get user from global react redux store
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const authService = useAuthService();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Function to handle showing the login modal
  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  // Function to handle hiding the login modal. useCallback keeps it the same
  // function between draws, so Login doesn't set up Google's button again
  // every time this navbar redraws.
  const handleHideLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

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
          {/* Keyed by the address, so moving to another page clears an earlier error */}
          <PageErrorBoundary key={location.pathname}>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/collections" element={<Collection />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/MyPage" element={<MyPage />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </Suspense>
          </PageErrorBoundary>
        </div>
        {/* Conditionally render the LoginModal */}
        {showLoginModal && (
          <PageErrorBoundary>
            <Suspense fallback={null}>
              <Login show={showLoginModal} onHide={handleHideLoginModal} />
            </Suspense>
          </PageErrorBoundary>
        )}
      </LoadingOverlay>
    </>
  );
}

export default React.memo(NavbarComp);
