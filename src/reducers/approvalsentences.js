//  Approval sentences reducer, keep track of sentences awaiting approval
export default (approvalsentences = [], action) => {
  switch (action.type) {
    case "FETCH_APPROVAL":
      return action.payload;
    default:
      return approvalsentences;
  }
};
