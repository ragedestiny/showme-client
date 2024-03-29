// user sentences reducer, keeps track of user sentences
const usersentences = (usersentences = [], action) => {
  switch (action.type) {
    case "FETCH_ALL":
      return [...action.payload];
    case "CREATE":
      return [...usersentences, action.payload];
    case "EDIT":
      return usersentences.map((sentence, i) => {
        if (sentence.title === action.payload.title) {
          return action.payload;
        }
        return sentence;
      });
    default:
      return usersentences;
  }
};

export default usersentences;
