import React from "react";
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

function NavbarComp() {
  // get user from global react redux store
  const user = useSelector((state) => state.user);

  // navigate to different pages with react
  const navigate = useNavigate();

  const dispatch = useDispatch();

  function navLogin() {
    setTimeout(() => {
      navigate("/");
    }, 200);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  }

  // on click, sign out user when there is a user signed in
  function signInorOut() {
    // sign out user if there there is one signed in
    if (user.length !== 0) {
      dispatch(logoutUser()).then(() =>
        setTimeout(() => {
          // navigate to homepage once logged out
          navigate("/");
        }, 300)
      );
    } else if (user.length === 0) {
      // navigate to login page if no user currently login
      navLogin();
    }
  }

  // React bootstrap Navbar and different routes for different parts of the website
  return (
    <>
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
                  {user.length === 0 ? `My Page` : `${user.firstName}'s Page`}
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  // to={user.length === 0 ? "/login" : "/"}
                  onClick={signInorOut}
                >
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
    </>
  );
}

export default React.memo(NavbarComp);
