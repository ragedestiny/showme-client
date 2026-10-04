import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import { editSentences } from "../actions/usersentences";
import { fetchUser } from "../actions/user";

// props.sentence: the sentence to edit; props.tell: its tell sentence;
// props.showEdit: whether to show the pencil (the mouse is over the sentence)
function EditModal(props) {
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

    const updatedSentenceInfo = {
      ...props.sentence,
      show: newSentence,
      createdAt: new Date(),
      approved: false,
      toRedo: false,
    };

    // Send the updated sentence to the backend. When it answers, the store's
    // list is updated, and MyPage shows the change.
    dispatch(editSentences(updatedSentenceInfo)).then(() =>
      dispatch(fetchUser())
    );

    // Clear out the modal textbox
    setNewSentence("");
  }

  // React bootstrap edit modal for editing the sentences
  return (
    <>
      <FontAwesomeIcon
        hidden={!props.showEdit}
        size="lg"
        onClick={handleShow}
        icon={faPenToSquare}
        bounce
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.tell}</Modal.Title>
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
