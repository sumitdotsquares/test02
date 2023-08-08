import { combineReducers } from "redux";
import searchQueryReducer from "./searchQueryReducer";
import noDatesReducer from "./noDatesReducer";
import resetDatesReducer from "./resetDatesReducer";
import placeholderReducer from "./placeholderReducer";
import selectedDuration from "./selectedDuration";

export default combineReducers({
  searchQuery: searchQueryReducer,
  noDates: noDatesReducer,
  resetDates: resetDatesReducer,
  placeholder: placeholderReducer,
  selectedDuration: selectedDuration,
});
