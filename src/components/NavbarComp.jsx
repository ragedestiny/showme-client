import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Routes, Route, Link } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../actions/sentences";

function NavbarComp() {
  // get user from global react redux store
  const user = useSelector((state) => state.user);

  // navigate to different pages with react
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // on click, sign out user when there is a user signed in
  function signout() {
    // sign out user if there there is one signed in
    if (user.length !== 0) {
      dispatch(logoutUser());
      // navigate to homepage once logged out
      navigate("/");
    }
  }

  // React bootstrap Navbar
  return (
    <>
      <div>
        <Navbar variant="light" style={{ backgroundColor: "#e3f2fd" }}>
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
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={"/MyPage"}>
                {user.length === 0 ? `My Page` : `${user.firstName}'s Page`}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={user.length === 0 ? "/login" : "/"}
                onClick={signout}
              >
                {user.length === 0 ? "Login" : "Logout"}
              </Nav.Link>
              <Nav.Link as={Link} to={"/about"}>
                About
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
      <div>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default NavbarComp;
