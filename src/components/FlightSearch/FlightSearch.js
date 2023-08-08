import React, { useState } from "react";
import { connect } from "react-redux";
import { selectAirport } from "../../actions";
import { FLIGHT_DATA } from "../../constant/index";

const FlightSearch = (props) => {
  let [inputValue, setinputValue] = useState("");

  let flightDropDown = document.querySelector(".flight-dropdown");
  return (
    <React.Fragment>
      <div className="flight-container search-input-container solmar-dropdown-container">
        <label htmlFor="flight-search"></label>
        <input
          className="input"
          type="text"
          value={inputValue}
          onFocus={props.handlefocus}
          placeholder={"No flights"}
          autoComplete="off"
          id="flight-search"
          disabled={
            Object.keys(props.autoComplete).length &&
            Object.keys(props.dates).length
              ? false
              : true
          }
        />
        <div
          className="flight-dropdown search-input-dropdown solmar-dropdown"
          style={{ display: "none" }}
        >
          <ul className="solmar-dropdown-inner">
            {FLIGHT_DATA.map((d, i) => (
              <li
                key={i}
                data-key={d}
                onClick={() => {
                  setinputValue(d.name),
                    props.selectAirport({ flight: d.code });
                  if (flightDropDown) flightDropDown.style.display = "none";
                }}
              >
                {d.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    autoComplete: state.searchQuery.location,
    dates: state.searchQuery.datepicker,
  };
};

export default connect(mapStateToProps, { selectAirport })(FlightSearch);
