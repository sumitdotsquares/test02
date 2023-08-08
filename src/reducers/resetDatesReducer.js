export default (state = false, action) => {
    switch (action.type) {
        case "RESETDATES":
            return action.payload;
        default:
            return state;
    }
};
