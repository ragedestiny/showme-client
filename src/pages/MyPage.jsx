import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import InputSentence from "../components/InputSentence";
import EditModal from "../components/EditModal";
import Pagination from "react-bootstrap/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { getUserSentences } from "../actions/usersentences";
import { useNavigate, useLocation } from "react-router-dom";
import * as config from "../../src/config";

function MyPage() {
  // get states from global react redux store
  const tellSentences = useSelector((state) => state.tellsentences);
  const user = useSelector((state) => state.user);
  const userSentences = useSelector((state) => state.usersentences);

  const dispatch = useDispatch();
  const location = useLocation();

  // set user sentences, pagination related States with React
  const [sentences, setSentences] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [pages, setPages] = useState(0);
  const [pagesArray, setPagesArray] = useState([]);
  const itemsPerPage = config.SentencesPerPageForMyPage;

  useEffect(() => {
    dispatch(getUserSentences());
  }, [dispatch, location]);

  // Run during first load
  useEffect(() => {
    if (userSentences) {
      setSentences(userSentences);
      const totalPages = Math.ceil(userSentences.length / itemsPerPage);
      setPages(totalPages);
      generatePagination(totalPages);
    }
  }, [userSentences]);

  useEffect(() => {
    // whenever active page and user sentences changes, update display sentences array for pagination
    generatePagination(pages);
  }, [activePage, sentences]);

  // create display sentence array for each page
  const generatePagination = (pageCount) => {
    const items = [];
    for (let number = 1; number <= pageCount; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === activePage}
          indexkey={number}
          onClick={(e) => setActivePage(+e.target.getAttribute("indexkey"))}
        >
          {number}
        </Pagination.Item>
      );
    }
    setPagesArray(items);
  };

  // update the user sentences display
  const updateSentences = (index, updatedSentence) => {
    setSentences((prev) => {
      const newSentences = [...prev];
      newSentences[index] = updatedSentence;
      return newSentences;
    });
    const totalPages = Math.ceil(userSentences.length / itemsPerPage);
    setPages(totalPages);
    generatePagination(totalPages);
  };

  // toggle the edit button
  const toggleEdit = (event) => {
    const index = +event.target.closest(".form")?.getAttribute("value");
    setSentences((prev) =>
      prev.map((sentence, i) =>
        i === index ? { ...sentence, hideedit: !sentence.hideedit } : sentence
      )
    );
  };

  // calculate the displayed sentences according to pagination
  const getPaginationRange = () => {
    const topitem =
      (pages - activePage) * itemsPerPage +
      (sentences.length % itemsPerPage === 0
        ? itemsPerPage
        : sentences.length % itemsPerPage);
    const bottomitem = Math.max(topitem - itemsPerPage, 0);
    return [topitem, bottomitem];
  };

  if (Object.keys(user)?.length !== 0) {
    // if there is a login user, display their own sentences
    return (
      <div className="contentmypage">
        <InputSentence
          sentences={tellSentences}
          count={sentences.length}
          updatelist={updateSentences}
        />

        <ListGroup as="ol">
          {[...sentences].reverse().map((sentence, i) => {
            const [topitem, bottomitem] = getPaginationRange();
            const index = sentences.length - i - 1;
            if (index < topitem && index >= bottomitem) {
              return (
                <ListGroup.Item
                  as="form"
                  className="d-flex justify-content-between align-items-start form"
                  key={index}
                  value={index}
                  onMouseOver={toggleEdit}
                  onMouseOut={toggleEdit}
                  style={{
                    backgroundColor:
                      sentence.approved === true
                        ? "#F1FEEC"
                        : sentence.toRedo === true
                        ? "#ffe1a8"
                        : "rgb(243, 236, 242)",
                  }}
                >
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip id="button-tooltip">
                        {sentence.approved === true
                          ? "Approved"
                          : sentence.toRedo === true
                          ? "Need To Redo"
                          : "Pending Approval"}
                      </Tooltip>
                    }
                  >
                    {({ ref, ...triggerHandler }) => (
                      <div className="ms-2 me-auto">
                        <div
                          className="fw-bold wordwrap"
                          {...triggerHandler}
                          ref={ref}
                        >
                          {sentence.show}
                        </div>
                        {tellSentences[index]?.tell}
                      </div>
                    )}
                  </OverlayTrigger>
                  <Badge bg="primary" pill>
                    {sentence.title?.toUpperCase()}
                  </Badge>
                  <EditModal
                    sentence={sentence}
                    sentences={sentences}
                    list={tellSentences}
                    index={index}
                    update={updateSentences}
                  />
                </ListGroup.Item>
              );
            }
          })}
        </ListGroup>
        <div className="pages">
          {pagesArray.length > 1 && (
            <Pagination size="sm">{pagesArray}</Pagination>
          )}
        </div>
      </div>
    );
  }
}
export default MyPage;
