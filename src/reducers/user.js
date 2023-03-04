// user reducer, keep track of user
export default (user = [], action) => {
  switch (action.type) {
    case "FIND_USER":
      return action.payload;
    case "LOGOUT":
      return action.payload;
    default:
      return user;
  }
};
