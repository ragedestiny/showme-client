import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComp from "./NavbarComp";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { getTellSentences } from "../actions/tellsentences";
import { BrowserRouter } from "react-router-dom";
import { fetchApprovedSentences } from "../actions/approvedsentences";

function App() {
  const dispatch = useDispatch();

  //as soon as App loads, fetch Tell sentences and approved sentences from server
  useEffect(() => {
    dispatch(getTellSentences());
    // dispatch(fetchApprovedSentences());
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
