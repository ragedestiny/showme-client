//  Approval sentences reducer, keep track of sentences awaiting approval
const approvalsentences = (approvalsentences = [], action) => {
  switch (action.type) {
    case "FETCH_APPROVAL":
      waitingForApproval = action.payload;
      return [...waitingForApproval];
    case "APPROVE":
      return action.payload;
    case "REDO":
      return action.payload;
    default:
      return approvalsentences;
  }
};

export default approvalsentences;
