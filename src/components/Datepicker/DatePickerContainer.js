import React from "react";
import Datepicker from "./Datepicker";
import "./DatePickerStyle.scss";
import { connect } from "react-redux";
import { getDuration } from "../../actions";
import moment from "moment";

let load = false;
const DatePickerContainer = (props) => {
  let datepickerPlaceholder, duration;
  if (
    !props.noDate &&
    !props.resetDate &&
    Object.keys(props.data).length &&
    Object.keys(props.date).length &&
    props.date.hasOwnProperty("start_date")
  ) {
    let startDate = !!props.date.start_date
      ? moment(props.date.start_date, "DDMMYYYY").format("ddd Do MMM, YYYY")
      : "No date";
    duration =
      moment(props.date.end_date, "DDMMYYYY").diff(
        moment(props.date.start_date, "DDMMYYYY"),
        "days"
      ) + 1;
    datepickerPlaceholder =
      !props.noDate && !props.resetDate && JSON.stringify(props.date) === "{}"
      ? `No date`
        : ` ${startDate}`;
    load = false;
  } else if (
    !props.noDate &&
    !props.resetDate &&
    Object.keys(props.data).length &&
    Object.keys(props.date).length &&
    props.date.hasOwnProperty("yearMonth")
  ) {
    datepickerPlaceholder = `${moment(props.date.yearMonth, "YYYY-MM").format(
      "MMMM YYYY"
    )} `;
    load = false;
  } else if (!props.resetDate && !props.noDate && props.placeholder) {
    let startDate = props.placeholder.hasOwnProperty("start_date")
      ? moment(props.placeholder.start_date, "DDMMYYYY").format(
          "ddd Do MMM, YYYY"
        )
      : "No date";
    datepickerPlaceholder = ` ${startDate}`;
    load = false;
  } else if (props.noDate && !props.resetDate && !load) {
    datepickerPlaceholder = `Search all dates`;
    load = false;
  } else if (props.resetDate && !props.noDate && !load) {
    datepickerPlaceholder = `No date`;
    load = false;
  } else if (!props.noDate && JSON.stringify(props.date) === "{}") {
    datepickerPlaceholder = `No date`;
    load = false;
  }

  return (
    <div className="datepicker-container search-input-container solmar-dropdown-container">
      <label htmlFor="date-search">Date</label>
      <input
        type="text"
        className="datepicker-input false-readonly"
        onFocus={props.handlefocus}
        // placeholder={datepickerPlaceholder?datepickerPlaceholder:"Select Dates"}
        value={datepickerPlaceholder ? datepickerPlaceholder : "No date"}
        id="date-search"
        // readOnly="true"
        readOnly={true}
      />

      <div
        className="datepicker-dropdown search-input-dropdown solmar-dropdown"
        style={{ display: "none" }}
      >
        <div className="solmar-dropdown-inner">
          <Datepicker />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    date: state.searchQuery.datepicker,
    data: state.searchQuery,
    placeholder: state.placeholder,
    noDate: state.noDates,
    resetDate: state.resetDates,
    duration: state.selectedDuration,
  };
};

export default connect(mapStateToProps, { getDuration })(DatePickerContainer);
