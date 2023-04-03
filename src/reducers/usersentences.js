// user sentences reducer, keeps track of user sentences
export default (usersentences = [], action) => {
  switch (action.type) {
    case "FETCH_ALL":
      return action.payload;
    case "CREATE":
      return [...usersentences, action.payload];
    case "EDIT": {
      const sentences = usersentences.map((sentence, i) => {
        if (sentence.title === action.payload.title) {
          return { ...action.payload };
        }
        return sentence;
      });
      return sentences;
    }
    default:
      return usersentences;
  }
};
