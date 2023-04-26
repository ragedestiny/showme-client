//  Approval sentences reducer, keep track of sentences awaiting approval
const approvalsentences = (approvalsentences = [], action) => {
  switch (action.type) {
    case "FETCH_APPROVAL":
      return action.payload;
    case "APPROVE":
      return action.payload;
    case "REDO":
      return action.payload;
    default:
      return approvalsentences;
  }
};

export default approvalsentences;
