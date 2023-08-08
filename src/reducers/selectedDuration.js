export default (state = { duration: 7 }, action) => {
    switch (action.type) {
      case "DURATION":
        return action.payload;
      default:
        return state;
    }
  };
  