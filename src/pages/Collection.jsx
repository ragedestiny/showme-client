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
  // keep track of loading state
  const [loading, setLoading] = useState(true);

  // randomize the sentences for display
  const randomizeSentences = () => {
    const randomized = [...approvedSentences]
      .map((sentence) => ({ sentence, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ sentence }) => sentence);
    setDisplay(randomized);
  };

  // Get the newest sentences for display - already sorted from the database
  const displayNewestSentences = () => {
    setDisplay(approvedSentences);
  };

  useEffect(() => {
    // once global redux state for approvedsentences updates, then update local state to display sentences

    if (load.current !== 0) {
      // Randomize sentences by default
      randomizeSentences();
      setLoading(false);
    }
    load.current++;
  }, [approvedSentences]);

  useEffect(() => {
    // Randomize Sentences on page load
    dispatch(fetchApprovedSentences());
  }, [dispatch]);

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
