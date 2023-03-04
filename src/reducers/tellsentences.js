// tell sentence reducer, keep track of tell sentences
export default (tellsentences = [], action) => {
  switch (action.type) {
    case "FETCH_TELL":
      return action.payload;
    default:
      return tellsentences;
  }
};
