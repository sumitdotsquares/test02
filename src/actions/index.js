export const selectLocation = (val) => {
  return {
    type: "LOCATION_SELECTED",
    payload: val,
  };
};

export const selectPassenger = (val) => {
  return {
    type: "PASSENGER",
    payload: val,
  };
};

export const getDate = (val) => {
  return {
    type: "DATE",
    payload: val,
  };
};

export const selectAirport = (val) => {
  return {
    type: "FLIGHT",
    payload: val,
  };
};

export const noDates = (val) => {
  return {
    type: "NODATES",
    payload: val,
  };
};

export const resetDates = (val) => {
  return {
    type: "RESETDATES",
    payload: val,
  };
};

export const fetchPlaceholder = (val) => {
  return {
    type: "FETCH_PLACEHOLDER",
    payload: val,
  };
};

export const getDuration = (val) => {
  return {
    type: "DURATION",
    payload: val,
  };
};
