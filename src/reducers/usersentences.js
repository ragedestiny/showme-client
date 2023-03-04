// user sentences reducer, keeps track of user sentences
export default (usersentences = [], action) => {
  switch (action.type) {
    case "FETCH_ALL":
      return action.payload;
    case "CREATE":
      return [...usersentences, action.payload];
    case "EDIT":
      return action.payload;
    default:
      return usersentences;
  }
};
