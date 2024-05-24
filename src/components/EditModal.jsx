import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { editSentences } from "../actions/usersentences";
import { fetchUser } from "../actions/user";

function EditModal(props) {
  // Pull states from global redux store
  const userSentences = useSelector((state) => state.usersentences);
  const dispatch = useDispatch();

  // show or hide the edit modal window
  const [show, setShow] = useState(false);

  // State for newly edited sentence
  const [newSentence, setNewSentence] = useState("");

  // handle showing and hiding the edit modal
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNewSentence(props.sentence.show); // Initialize with the current sentence when the modal is shown
    setShow(true);
  };

  // update the edited sentence
  function updateSentence() {
    // If nothing is entered, just return nothing
    if (newSentence.trim() === "") return;

    // update the user sentences once the edited sentence is submitted
    const sentenceInfo = userSentences[props.index];

    const updatedSentenceInfo = {
      ...sentenceInfo,
      show: newSentence,
      createdAt: new Date(),
      approved: false,
      toRedo: false,
    };

    // Send the updated sentence to the backend and update our database
    dispatch(editSentences(updatedSentenceInfo)).then(() =>
      dispatch(fetchUser())
    );

    // update frontend display
    props.update(props.index, updatedSentenceInfo);
    // Clear out the modal textbox
    setNewSentence("");
  }

  // React bootstrap edit modal for editing the sentences
  return (
    <>
      <FontAwesomeIcon
        hidden={props.sentence.hideedit}
        size="lg"
        onClick={handleShow}
        icon={faPenToSquare}
        bounce
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.list[props.index]?.tell}</Modal.Title>
        </Modal.Header>
        <form>
          <Modal.Body
            autoFocus
            as="textarea"
            className="form-control"
            rows={4}
            value={newSentence}
            onChange={(e) => setNewSentence(e.target.value)}
          ></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                updateSentence();
                handleClose();
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default EditModal;
