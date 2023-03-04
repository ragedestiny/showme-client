import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComp from "./NavbarComp";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { getTellSentences } from "../actions/sentences";
import { BrowserRouter } from "react-router-dom";

function App() {
  const dispatch = useDispatch();

  //as soon as App loads, fetch Tell sentences from server
  useEffect(() => {
    dispatch(getTellSentences());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <NavbarComp />
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
