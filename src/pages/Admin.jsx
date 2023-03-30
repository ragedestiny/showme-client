import React, { useEffect } from "react";
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
import { fetchApprovalSentences } from "../actions/sentences";

function Admin() {
  const user = useSelector((state) => state.user);
  const sentencesAwaitingApproval = useSelector(
    (state) => state.approvalsentences
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id !== process.env.REACT_APP_ADMIN_ID) {
      navigate("/");
    }

    dispatch(fetchApprovalSentences());
  }, []);
  console.log(sentencesAwaitingApproval);

  if (user.id === process.env.REACT_APP_ADMIN_ID) {
    return (
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
                      {sentencesAwaitingApproval
                        .sort(
                          (a, b) =>
                            Date.parse(b.createdAt) - Date.parse(a.createdAt)
                        )
                        .map((sentence) => {
                          return (
                            <tr className="fw-normal">
                              <th width="15%">
                                {/* <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
                            alt="avatar"
                            className="shadow-1-strong rounded-circle"
                            style={{ width: "30px", height: "auto" }}
                          /> */}
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
    );
  }
}

export default Admin;
