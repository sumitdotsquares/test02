export default (state = {}, action) => {
    switch (action.type) {
      case "FETCH_PLACEHOLDER":
        return action.payload;
      default:
        return state;
    }
  };
  