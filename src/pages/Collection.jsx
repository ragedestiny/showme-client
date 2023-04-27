import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedSentences } from "../actions/approvedsentences";
import Cards from "../components/Cards";
import FadeMenu from "../components/FadeMenu";

function Collection() {
  // get approved sentences from redux global state
  const approvedSentences = useSelector((state) => state.approvedsentences);

  const dispatch = useDispatch();

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
    // once global redux state for approvedsentences updates, then update local state to display manipulation
    setDisplay(() => approvedSentences);
    // Randomize sentences by default
    Randomize();
  }, [approvedSentences]);

  // on first render, fetch approved sentences from database
  useEffect(() => {
    dispatch(fetchApprovedSentences());
  }, []);

  // collection page to display approved sentences
  if (approvedSentences.length !== 0) {
    return (
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
}

export default Collection;
