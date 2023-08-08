import React, { useState, useEffect,useRef } from "react";
import { DURATIONLABEL } from "../../constant";
import "./DurationInput.scss";
import { getDuration } from "../../actions";
import { connect } from "react-redux";

const DurationInput = (props) => {
  let [durationValue, setDurationValue] = useState(["7"]);
  let [showMoreDuration, setShowMoreDuration] = useState(true);

  const handleDurationOnClick = () => {
    if( document.querySelector(".autocomplete-dropdown-new")){
      document.querySelector(".autocomplete-dropdown-new").style.display = "none";
    }
   // document.querySelector(".autocomplete-dropdown-new").style.display = "none";
    if (
      document.querySelector(".duration-item-dropdown").style.display == "block"
    )
      document.querySelector(".duration-item-dropdown").style.display = "none";
    else
      document.querySelector(".duration-item-dropdown").style.display = "block";
  };

  const handleCheck = (event) => {
    const { value, checked } = event.target;
    if(checked){
      setDurationValue([...durationValue, value]);
    }else{
      let removedvalue = durationValue.filter((event)=> event !=value);
      setDurationValue(removedvalue);
    }
  };

  const handleShowDuration = () => {
    let temp_display = "";
    if (document.querySelector(".durationAll").style.display == "block")
      temp_display = "none";
    else temp_display = "block";

    const nodeList = document.querySelectorAll(".durationAll");
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].style.display = temp_display;
    }

    setShowMoreDuration(!showMoreDuration);
  };

  const DURATIONLABEL0 = [
    "3-4",
    "5-6",
    "7",
    "10-11",
    "14",
    "21",
    "28",
  ];

  useEffect(() => {
    props.getDuration({duration:durationValue});
  }, [durationValue]);

  const handleDurationReset = () =>{
    setDurationValue(["7"]);
    document.querySelector(".duration-item-dropdown").style.display == "none"
  }
  return (
    <div className="datepicker-container search-input-container solmar-dropdown-container">
      <label htmlFor="duration-search">Duration</label>
      <input
        type="text"
        className="datepicker-input false-readonly"
        onClick={handleDurationOnClick}
        value={durationValue + " nights"}
        id="duration-search"
        readOnly={true}
      />
      <div
        className="duration-item-dropdown search-input-dropdown solmar-dropdown solmar-dropdown-main-search"
        style={{ display: "none" }}
      >
        <ul className="solmar-dropdown-inner">
          {DURATIONLABEL.map((item, index) => (
            <li
              key={index}
              className={DURATIONLABEL0.indexOf(item) > -1 ? "" : "durationAll"}
            >
              <input value={item.replace('+','')} type="checkbox" onChange={handleCheck} checked={durationValue?.includes(item.replace('+',''))} />
              <span>{item + " nights"}</span>
            </li>
          ))}
          <li>
            <a id="duration_box" onClick={handleShowDuration}>
              {showMoreDuration
                ? "Show all durations"
                : "Show popular durations only"}
            </a>
            <span className="durations-reset" onClick={handleDurationReset}>Reset</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    noDate: state.noDates,
    resetDate: state.resetDates,
    date: state.searchQuery.datepicker,
    duration: state.selectedDuration,
  };
};

export default connect(mapStateToProps, {
  getDuration,
})(DurationInput);
