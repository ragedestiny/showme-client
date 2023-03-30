import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { editSentences } from "../actions/sentences";

function EditModal(props) {
  // Pull states from global redux store
  const user = useSelector((state) => state.user);
  const userSentences = useSelector((state) => state.usersentences);
  const dispatch = useDispatch();

  // show or hide the edit modal window
  const [show, setShow] = useState(false);

  // State for newly edited sentence
  const [newSentence, setNewSentence] = useState("0");

  // handle showing and hiding the edit modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // update the edited sentence
  function updateSentence() {
    // if nothing is entered, just return nothing
    if (newSentence === "" || newSentence === "0") return;

    // update the user sentences once the edited sentence is submitted
    let sentenceInfo;
    const updatedSentences = userSentences.map((sentence, index) => {
      // only update the sentence that was changed
      if (index === props.index) {
        sentenceInfo = {
          ...sentence,
          show: newSentence,
          // new date since it was just edited
          createdAt: new Date(),
          // reset - teacher needs to recheck sentence again
          approved: false,
          toRedo: false,
        };
        return sentenceInfo;
      }
      // return the other unedited sentences as is
      return sentence;
    });

    // keep track of the updated sentences using React state
    props.update(updatedSentences);

    // sending the updated sentences to the backend and update our database
    dispatch(editSentences([user.id, sentenceInfo, updatedSentences]));

    // clear out the modal textbox
    setNewSentence("0");
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
            // placeholder="Update your sentence"
            value={newSentence === "0" ? props.sentence.show : newSentence}
            onChange={(e) => setNewSentence(e.target.value)}
          ></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={(event) => {
                handleClose();
                updateSentence(event);
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
