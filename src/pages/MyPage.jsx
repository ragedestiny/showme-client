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
import { useNavigate } from "react-router-dom";

function MyPage() {
  // get states from global react redux store
  const tellSentences = useSelector((state) => state.tellsentences);
  const user = useSelector((state) => state.user);

  // navigate from react router
  const navigate = useNavigate();

  // dispatch from react redux
  const dispatch = useDispatch();

  // If there is no logged in user, redirect to login page
  if (Object.keys(user)?.length === 0) {
    setTimeout(() => {
      navigate("/Login");
    }, 300);
  }

  // set user sentences, pagination related States with React
  const [sentences, setSentences] = useState(user?.ownSentences);
  const [activePage, setActivePage] = useState(1);
  const [pages, setPages] = useState(0);
  const [pagesArray, setPagesArray] = useState([]);
  const itemsPerPage = 8;

  // create display sentence array for each page
  function amountOfPages(pageCount) {
    const items = [];
    for (let number = 1; number <= pageCount; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === activePage}
          indexkey={number}
          onClick={(e) => {
            setActivePage(+e.target.getAttribute("indexkey"));
          }}
        >
          {number}
        </Pagination.Item>
      );
    }
    setPagesArray([...items]);
  }

  // update the user sentences display
  function updateSentences(updatedSentences) {
    // update the user sentences for state
    setSentences([...updatedSentences]);
    // find out the new total pages
    const totalPages = Math.ceil(updatedSentences.length / itemsPerPage);
    // set total amount of pages
    setPages(totalPages);
    // send total pages to create display sentence array for each page
    amountOfPages(totalPages);
  }

  // toggle the edit button
  function toggleEdit(event) {
    const index = +event.target.closest(".form")?.getAttribute("value");
    setSentences((prev) => {
      return prev.map((sentence, i) => {
        if (i === index) {
          const update = {
            ...sentence,
            // toggle the display for the edit button
            hideedit: !sentence.hideedit,
          };
          return update;
        }
        return sentence;
      });
    });
  }

  useEffect(() => {
    // whenever active page and user sentences changes, update display sentences array for pagination
    amountOfPages(pages);
  }, [activePage, sentences]);

  // Run during first load
  useEffect(() => {
    // grab user sentences from database
    dispatch(getUserSentences(user));

    // set user sentence start
    setSentences(user?.ownSentences);

    // total amount of pages of user sentences
    const totalPages = Math.ceil(sentences?.length / itemsPerPage);

    // set total page state
    setPages(totalPages);

    // send total pages to create display sentence array for each page
    amountOfPages(totalPages);
  }, []);

  // calculate the displayed sentences according to pagination
  function topbottom() {
    const topitem =
      (pages - activePage) * itemsPerPage +
      (sentences?.length % itemsPerPage === 0
        ? itemsPerPage
        : sentences.length % itemsPerPage);
    const bottomitem = Math.max(topitem - itemsPerPage, 0);
    return [topitem, bottomitem];
  }

  // if there is a login user, display their own sentences
  if (Object.keys(user)?.length !== 0) {
    // Display MyPage
    return (
      <div className="contentmypage">
        <InputSentence
          sentences={tellSentences}
          count={sentences.length}
          updatelist={updateSentences}
        />

        <ListGroup as="ol">
          {[...sentences].reverse().map((sentence, i) => {
            const [topitem, bottomitem] = topbottom();
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
