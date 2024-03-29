import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { useDispatch, useSelector } from "react-redux";
import { createSentence } from "../actions/usersentences";
import { fetchUser } from "../actions/user";

function InputSentence(props) {
  // Load user from global React redux state if it is loaded already
  const user = useSelector?.((state) => state.user);
  const userSentences = useSelector((state) => state.usersentences);

  // set states for current tellsentence/ user sentence / day
  const [day, setDay] = useState(props.count + 1);
  const [sentence, setSentences] = useState(
    props.sentences[props.count]?.tell || "Come Back Later For More Sentences! "
  );
  const [newSentence, setNewSentences] = useState("");

  // for react redux
  const dispatch = useDispatch();

  // once a new sentence is entered, update the page and send update to database
  function handleSubmit(event) {
    // prevents the page from refreshing
    event.preventDefault();

    // if user didn't enter anything, disregard submit
    if (newSentence === "") return;

    // create new show sentence
    const newEntry = {
      title: "day" + day,
      tell: sentence,
      show: newSentence,
      hideedit: true,
      author: user._id,
      GID: user.id,
    };

    // check to see if there are more tell sentences after this one
    const totalcount = props.sentences.length;

    // verify sentence count
    if (day <= totalcount) {
      // send sentence to backend database, update redux store with responses
      dispatch(createSentence(newEntry)).then(() =>
        dispatch(fetchUser({ sub: user.id }))
      );

      // update frontend display
      props.updatelist([...userSentences, newEntry]);
      const newDay = day + 1;
      setDay(newDay);

      // display the next tell sentence if there are more
      newDay <= totalcount
        ? setSentences(props.sentences[day].tell)
        : setSentences("Come Back Later For More Sentences! ");
    }

    // clear the input textbox
    setNewSentences("");
  }

  // form component for inputting new sentence
  return (
    <Container className="formContainer">
      <Form>
        <Form.Group className="mb-3" controlId="currentsentence">
          <Form.Text>Day {day}</Form.Text>
          <br></br>
          <Form.Label>
            {sentence ?? props.sentences[props.count]?.tell}
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Don't just tell me, instead SHOW ME!"
            value={newSentence}
            onChange={(e) => setNewSentences(e.target.value)}
          />
        </Form.Group>
        <div className="submitSentence">
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Show ME!
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default InputSentence;
