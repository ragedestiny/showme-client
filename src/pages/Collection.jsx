import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cards from "../components/Cards";
import FadeMenu from "../components/FadeMenu";
import LoadingOverlay from "react-loading-overlay-ts";
import { fetchApprovedSentences } from "../actions/approvedsentences";

function Collection() {
  // get approved sentences from redux global state
  const approvedSentences = useSelector((state) => state.approvedsentences);
  const dispatch = useDispatch();

  // tracking first page load
  const load = useRef(0);

  // keep track of local state of sentences being displayed
  const [displaySentences, setDisplay] = useState([]);

  // randomize the sentences for display
  function Randomize() {
    const randomized = [...approvedSentences]
      .map((sentence) => ({ sentence, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ sentence }) => sentence);
    setDisplay(randomized);
  }

  // grab the newest sentences for display - already sorted from database
  function Newest() {
    const newest = approvedSentences;
    setDisplay(newest);
  }

  useEffect(() => {
    // once global redux state for approvedsentences updates, then update local state to display sentences

    if (load.current !== 0) {
      // Randomize sentences by default
      Randomize();
    }
    load.current++;
  }, [approvedSentences]);

  useEffect(() => {
    // Randomize Sentences on page load
    dispatch(fetchApprovedSentences());
  }, []);

  // collection page to display approved sentences
  return approvedSentences.length === 0 ? (
    <LoadingOverlay
      active={true}
      spinner
      text="Loading..."
      className="contentcollection"
    ></LoadingOverlay>
  ) : (
    <div className="contentcollection">
      <div className="dropdown">
        <FadeMenu newest={Newest} randomize={Randomize} />
      </div>
      <div>
        <Cards displaySentences={displaySentences} />
      </div>
    </div>
  );
}

export default React.memo(Collection);
