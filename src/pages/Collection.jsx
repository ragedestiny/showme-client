import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cards from "../components/Cards";
import FadeMenu from "../components/FadeMenu";
import LoadingOverlay from "react-loading-overlay-ts";
import { fetchApprovedSentences } from "../actions/approvedsentences";

// A copy of the list in a random order
const shuffle = (sentences) =>
  [...sentences]
    .map((sentence) => ({ sentence, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ sentence }) => sentence);

function Collection() {
  // get approved sentences from redux global state
  const approvedSentences = useSelector((state) => state.approvedsentences);
  const dispatch = useDispatch();

  // The order chosen for display (random by default), and whether we're still
  // waiting for the server's list
  const [displaySentences, setDisplay] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ask the server for the approved sentences once, and shuffle them as soon
  // as they arrive. (Using the answer directly means an old list the browser
  // may have remembered is never shown.)
  useEffect(() => {
    let stillHere = true;
    dispatch(fetchApprovedSentences()).then((sentences) => {
      if (!stillHere) return; // the visitor already left this page
      setDisplay(shuffle(sentences));
      setLoading(false);
    });
    return () => {
      stillHere = false;
    };
  }, [dispatch]);

  // The sort menu's choices
  const randomizeSentences = () => setDisplay(shuffle(approvedSentences));
  const displayNewestSentences = () => setDisplay(approvedSentences);

  // collection page to display approved sentences
  return (
    <LoadingOverlay
      active={loading}
      spinner
      text="Loading..."
      className="contentcollection"
    >
      <div className="dropdown">
        <FadeMenu
          newest={displayNewestSentences}
          randomize={randomizeSentences}
        />
      </div>
      <div>
        <Cards displaySentences={displaySentences} />
      </div>
    </LoadingOverlay>
  );
}

export default React.memo(Collection);
