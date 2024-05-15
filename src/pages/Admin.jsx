import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTooltip,
} from "mdb-react-ui-kit";
import {
  approveSentence,
  fetchApprovalSentences,
  redoSentence,
} from "../actions/approvalsentences";
import LoadingOverlay from "react-loading-overlay-ts";

function Admin() {
  // grab global state from redux store
  const user = useSelector((state) => state.user);
  const sentencesAwaitingApproval = useSelector(
    (state) => state.approvalsentences
  );
  // create state for loading spinner
  const [isActive, setActive] = useState(false);

  // dispatch for redux
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    // if user is not admin, send back to home page
    if (user.id !== process.env.REACT_APP_ADMIN_ID) {
      navigate("/");
    }
    // retrieve all sentences pending approval
    dispatch(fetchApprovalSentences());
  }, []);

  function handleApprove(event) {
    // find the index of sentence that has been approved
    const index = +event.target.closest(".approve-redo")?.getAttribute("value");
    // load loading spinner
    setActive(!isActive);
    // send the approved sentence to backend and update database and redux store
    dispatch(
      approveSentence(["approve", user, sentencesAwaitingApproval[index]])
    ).then(() => setActive(false));
  }

  function handleRedo(event) {
    // find the index of sentence that has been rejected
    const index = +event.target.closest(".approve-redo")?.getAttribute("value");
    // load loading spinner
    setActive(!isActive);
    // send the rejected sentence to backend and update database and redux store
    dispatch(
      redoSentence(["redo", user, sentencesAwaitingApproval[index]])
    ).then(() => setActive(false));
  }

  // only render page if login user is admin
  if (user.id === process.env.REACT_APP_ADMIN_ID) {
    return (
      <LoadingOverlay active={isActive} spinner text="Loading...">
        <section className="gradient-custom-2 vh-100">
          <MDBContainer className="py-5 h-100 approvallist">
            <MDBRow className="d-flex justify-content-center align-items-center">
              <MDBCol md="12" xl="12">
                <MDBCard>
                  <MDBCardHeader className="p-3">
                    <h5 className="mb-0">
                      <MDBIcon fas icon="tasks" className="me-2" />
                      Sentences Awaiting Approval
                    </h5>
                  </MDBCardHeader>

                  <MDBCardBody>
                    <MDBTable className="mb-0">
                      <MDBTableHead>
                        <tr>
                          <th scope="col">Student</th>
                          <th scope="col">Show Sentence</th>
                          <th scope="col">Tell Sentence</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {[...sentencesAwaitingApproval].map((sentence, i) => {
                          return (
                            <tr
                              className="fw-normal approve-redo"
                              value={i}
                              key={i}
                            >
                              <th width="15%">
                                <span className="ms-2">
                                  {sentence.author.firstName +
                                    " " +
                                    sentence.author.lastName}
                                </span>
                              </th>
                              <td className="align-middle" width="55%">
                                <h6 className="mb-0">
                                  <span>{sentence.show}</span>
                                </h6>
                              </td>
                              <td className="align-middle" width="20%">
                                <span>{sentence.tell}</span>
                              </td>
                              <td className="align-middle" width="10%">
                                <MDBTooltip
                                  tag="a"
                                  wrapperProps={{ href: "#!" }}
                                  title="Approve"
                                >
                                  <MDBIcon
                                    fas
                                    icon="check"
                                    color="success"
                                    size="lg"
                                    className="me-3"
                                    onClick={handleApprove}
                                  />
                                </MDBTooltip>
                                <MDBTooltip
                                  tag="a"
                                  wrapperProps={{ href: "#!" }}
                                  title="Redo"
                                >
                                  <MDBIcon
                                    fas
                                    icon="redo"
                                    color="warning"
                                    size="lg"
                                    className="me-3"
                                    onClick={handleRedo}
                                  />
                                </MDBTooltip>
                              </td>
                            </tr>
                          );
                        })}
                      </MDBTableBody>
                    </MDBTable>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </LoadingOverlay>
    );
  }
}

export default Admin;
