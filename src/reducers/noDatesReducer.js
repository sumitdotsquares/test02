export default (state = false, action) => {
    switch (action.type) {
        case "NODATES":
            return action.payload;
        default:
            return state;
    }
};
