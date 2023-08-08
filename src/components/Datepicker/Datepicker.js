/** @jsx jsx */
import { useState, useEffect, memo } from "react";
import { useDatepicker, START_DATE } from "@datepicker-react/hooks";
import { jsx } from "@emotion/core";
import Month from "./Month";
import NavButton from "./NavButton";
import DatepickerContext from "./datepickerContext";
import MonthFilter from "./MonthFilter";
// import getDayRange from "./utils/getDayRange";
import { connect } from "react-redux";
import { getDate, noDates, resetDates, getDuration } from "../../actions";
import moment from "moment";
import { DURATIONLABEL } from "../../constant";
import utils from "../utils/utils";

function Datepicker(props) {
  let start, end, duration;
  if (window.location.search.length) {
    let query = utils.queryStringParse(
      decodeURIComponent(window.location.search)
    );
    duration = query.hasOwnProperty("duration") ? query.duration : 3;
    start = query.hasOwnProperty("start_date")
      ? moment(query.start_date, "DDMMYYYY").toDate()
      : null;
    end = query.hasOwnProperty("end_date")
      ? moment(query.end_date, "DDMMYYYY").toDate()
      : null;
  }

  const [state, setState] = useState({
    startDate: !!start ? start : null,
    endDate: !!end ? end : null,
    focusedInput: START_DATE,
  });
  let [daysrange, setdayrange] = useState(Number(duration ? duration : 7) + 1);
  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
    // onResetDates
  } = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    onDatesChange: handleDateChange,
    numberOfMonths: 1,
    minBookingDays: daysrange,
    exactMinBookingDays: true,
    initialVisibleMonth: !!start ? start : moment().toDate(),
  });

  let [searchbyDay, setsearchbyDay] = useState(true);
  let [durationValue, setDurationValue] = useState(duration ? duration : 7);
  // let [noDates, setNoDates] = useState(true);

  function handleDateChange(data) {
    if (!data.focusedInput) {
      setState({ ...data, focusedInput: START_DATE });
    } else {
      setState(data);
    }
  }

  const handleDurationOnfocus = () => {
    document.querySelector(".duration-item-dropdown").style.display = "block";
  };

  useEffect(() => {
    document.getElementById("no-dates").addEventListener("click", () => {
      document.querySelector(".datepicker-dropdown").style.display = "none";
    });
  }, []);
  // const durationFilter =
  //   DURATIONLABEL.length > 0 ? (
  //     <div className="datepicker-duration solmar-dropdown-container">
  //       <label htmlFor="duration-list"></label>
  //       <input
  //         className="input"
  //         type="text"
  //         value={durationValue}
  //         onFocus={handleDurationOnfocus}
  //         autoComplete="off"
  //         id="duration-list"
  //       />
  //       <div
  //         className="duration-item-dropdown search-input-dropdown solmar-dropdown"
  //         style={{ display: "none" }}
  //       >
  //         <ul className="solmar-dropdown-inner">
  //           {DURATIONLABEL.map((item, index) => (
  //             <li
  //               key={item}
  //               data-key={index}
  //               onClick={() => {
  //                 setDurationValue(+item.substring(0, 2));
  //                 setdayrange(Number(item.substring(0, 2)) + 1);
  //                 document.querySelector(
  //                   ".duration-item-dropdown"
  //                 ).style.display = "none";
  //                 if (!!state.startDate) {
  //                   let start_date = moment(state.startDate).format("DDMMYYYY");
  //                   let end_date = moment(start_date, "DDMMYYYY")
  //                     .add(+item.substring(0, 2), "days")
  //                     .format("DDMMYYYY");
  //                   props.getDate({ start_date, end_date });
  //                   setState({
  //                     startDate: state.startDate,
  //                     endDate: moment(end_date, "DDMMYYYY")._d,
  //                     focusedInput: START_DATE,
  //                   });
  //                 }
  //                 // props.getDate({});
  //                 // onResetDates();
  //               }}
  //             >
  //               {item}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   ) : null;

  // const handleDuration = () => {
  //   let value = document.getElementById("Duration").value;
  //   setdayrange(Number(value) + 1);
  // };

  const handledaySeach = () => {
    setsearchbyDay(true);
  };

  const handlemonthSeach = () => {
    setsearchbyDay(false);
  };

  let date = new Date();
  let today = {
    day: date.getDate(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };

  const validateCalender = () => {
    if (activeMonths[0].year === today.year) {
      if (activeMonths[0].month >= today.month) return false;
      else return true;
    } else if (activeMonths[0].year >= today.year) {
      return false;
    } else return true;
  };

  useEffect(() => {
    if(props.duration.duration.length > 0  &&  (props.duration.duration.length > 1 || !props.duration.duration.includes("7"))){
      let DurationArray = props.duration.duration.reduce((acc, element) => acc.concat(element.split('-')), []);
      let numericArray = DurationArray.map(item => parseInt(item));
      let MaxDurationValue = Math.max(...numericArray)
      const startDate = new Date(); // Get the current date
      startDate.setDate(startDate.getDate() + 2); // Add two days
      
      const options = {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      };
      const formattedStartDate = startDate.toLocaleDateString('en-US', options);
      const endDate = new Date(); // Get the current date
      endDate.setDate(endDate.getDate() + MaxDurationValue+1); // Add two days
      const formattedendDate = endDate.toLocaleDateString('en-US', options);
      let end_date = moment(formattedendDate)
      .format("DDMMYYYY");
      console.log(end_date,"end_date");
      props.getDate({
        start_date: moment(formattedStartDate).format("DDMMYYYY"),
        end_date: end_date != "Invalid date"?end_date:moment(formattedendDate).format("DDMMYYYY")+1,
      });
      props.noDates(false);
      props.resetDates(false);
      setdayrange(MaxDurationValue + 1)
      document.querySelector('#no-dates').disabled = true;
      document.querySelector('[for="no-dates"]').style.color = "#bdbdbda6";
      let showTitle = document.querySelector('#noDates')
      if(showTitle){
        showTitle.setAttribute("title", "Please select one duration only to search all dates");
        function isMobileDevice() {
          return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
        }
        if (isMobileDevice()) {
          // Touch event to show the title attribute value
          showTitle.addEventListener("touchstart", function() {
            showTitle.setAttribute("title", "Please select one duration only to search all dates");
            if(document.querySelector('#no-dates').disabled){
              //alert(showTitle.getAttribute("title"))
              let mobileMessage = document.getElementById("mobileMessage");
              mobileMessage.innerText = "Please select one duration only to search all dates"
              function automaticHide() {
                mobileMessage.innerText = ""
              }
              
              // Set the timeout for 3 seconds (3000 milliseconds)
              setTimeout(automaticHide, 2000);
            }
          });
        }
      }
    }else{
      setdayrange(Number(duration ? duration : 7) + 1)
      props.getDate({});
      document.querySelector('#no-dates').disabled = false;
      document.querySelector('[for="no-dates"]').style.color = "#ffff";
      let mobileMessage = document.getElementById("mobileMessage");
      mobileMessage.innerText = ""
    }
  }, [props.duration.duration]);

  useEffect(() => {
    console.log(state.startDate,"state.startDate");
    if (state.startDate) {
      let end_date = moment(state.endDate)
        .subtract(1, "days")
        .format("DDMMYYYY");
      props.getDate({
        start_date: moment(state.startDate).format("DDMMYYYY"),
        end_date: end_date != "Invalid date"?end_date:moment(state.startDate).format("DDMMYYYY")+1,
      });
      props.noDates(false);
      props.resetDates(false);
    }
  }, [state]);

  useEffect(() => {
    props.getDuration({ duration: durationValue });
  }, [durationValue]);

  // useEffect(() => {
  //   let durationLayout = document.querySelector(".datepicker-duration");
  //   document.addEventListener("click", function(event) {
  //     if (!durationLayout.contains(event.target)) {
  //       document.querySelector(".duration-item-dropdown").style.display =
  //         "none";
  //     }
  //   });
  // });

  const handleHideSelf = ()=>{
    if(document.querySelector('.datepicker-dropdown')) {
      document.querySelector('.datepicker-dropdown').style.display = "none";
    }
  }

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
      }}
    >
      <div className="datepicker-top">
        {/* <div className="date-duration">
          <label htmlFor="Duration">Select Duration:</label>
          {durationFilter}
        </div> */}
        <div class="close-btn hide-for-medium desti" onClick={handleHideSelf}>
          <img src="/themes/custom/solm/images/close-button.svg"/>          
        </div>
      </div>

      <div className="date-buttons">
        <button
          onClick={handledaySeach}
          className={searchbyDay ? "search-active" : null}
        >
          Search by date
        </button>
        <button
          onClick={handlemonthSeach}
          className={searchbyDay ? null : "search-active"}
        >
          Search by month
        </button>
      </div>

      {searchbyDay && (
        <div className="day-picker" id="day-picker-wrapper-wrapper">
          <div className="date-picker-nav-buttons">
            <NavButton
              onClick={goToPreviousMonths}
              disabled={validateCalender()}
              id="previous-month"
            >
              {/* <img src="/themes/custom/solm/images/solmar_arrow_left.svg"/> */}
            </NavButton>
            <NavButton onClick={goToNextMonths} id="next-month">
              {/* <img src="/themes/custom/solm/images/solmar_arrow.svg"/> */}
            </NavButton>
          </div>

          <div
            id="input"
            placeholder="No date"
            css={{
              display: "grid",
              gridTemplateColumns: `repeat(${activeMonths.length}, auto)`,
            }}
            className="day-picker-wrapper"
          >
            {activeMonths.map((month) => (
              <Month
                key={`${month.year}-${month.month}`}
                year={month.year}
                month={month.month}
                firstDayOfWeek={firstDayOfWeek}
              />
            ))}
          </div>
        </div>
      )}
      {!searchbyDay && (
        <div id="monthSearch" className="month-picker">
          <MonthFilter activeMonths={activeMonths}></MonthFilter>
        </div>
      )}

      <div className="datepicker-bottom">
        <div className="date-optional">
          <input
            type="checkbox"
            id="no-dates"
            name="no-dates"
            // defaultChecked={props.noDate}
            checked={props.noDate}
            onChange={() => {
              if (props.noDate === true) {
                props.noDates(true);
                props.resetDates(false);
              } else {
                props.noDates(true);
                props.resetDates(false);

                props.getDate({});
                setState({
                  startDate: null,
                  endDate: null,
                  focusedInput: START_DATE,
                });
              }
            }}
          />
          <label htmlFor="no-dates" id="noDates">I don't know my dates</label>
          <span id="mobileMessage"></span>
        </div>
      </div>
    </DatepickerContext.Provider>
  );
}

const mapStateToProps = (state) => {
  return {
    noDate: state.noDates,
    resetDate: state.resetDates,
    date: state.searchQuery.datepicker,
    duration: state.selectedDuration,
  };
};
export default connect(mapStateToProps, {
  getDate,
  noDates,
  resetDates,
  getDuration,
})(Datepicker);
