// user reducer, keep track of user
const user = (user = [], action) => {
  switch (action.type) {
    case "FIND_USER":
      return action.payload;
    case "LOGOUT":
      return [];
    default:
      return user;
  }
};

export default user;
