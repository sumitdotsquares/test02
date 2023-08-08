/** @jsx jsx */
import React, { useState } from "react";
import { jsx } from "@emotion/core";
import NavButton from "./NavButton";
import { connect } from "react-redux";
import { getDate, noDates, resetDates } from "../../actions";
import moment from "moment";

const MonthFilter = (props) => {
  let { activeMonths } = props;
  let calender = [
    { month: "January", monthNo: 0, isDisable: false },
    { month: "February", monthNo: 1, isDisable: false },
    { month: "March", monthNo: 2, isDisable: false },
    { month: "April", monthNo: 3, isDisable: false },
    { month: "May", monthNo: 4, isDisable: false },
    { month: "June", monthNo: 5, isDisable: false },
    { month: "July", monthNo: 6, isDisable: false },
    { month: "August", monthNo: 7, isDisable: false },
    { month: "September", monthNo: 8, isDisable: false },
    { month: "October", monthNo: 9, isDisable: false },
    { month: "November", monthNo: 10, isDisable: false },
    { month: "December", monthNo: 11, isDisable: false },
  ];
  let date = new Date();
  let [year, setyear] = useState(activeMonths[0].year);
  let [months, setMonths] = useState(calender);
  let [currentYear, setCurrentYear] = useState(date.getFullYear());
  let isFirstLoad = false;

  React.useEffect(() => {
    handleMonthBehaviour();
  }, []);

  // React.useEffect(()=>{
  //   document.getElementById('').addEventListener('click',()=>{

  //   })
  // })

  const handleMonthBehaviour = (isFirstLoad = true) => {
    let today = {
      day: date.getDate(),
      year: date.getFullYear(),
      month: date.getMonth(),
    };
    if (isFirstLoad) {
      setyear(activeMonths[0].year);
      setCurrentYear(today.year);
    }
    if (year === currentYear) {
      calender = months.map((d) => {
        if (today.month > d.monthNo) {
          return { ...d, isDisable: true };
        } else {
          return { ...d };
        }
      });
      setMonths(calender);
    } else if (year > currentYear) {
      calender = months.map((d) => {
        return { ...d, isDisable: false };
      });
      setMonths(calender);
    }
  };

  const handleMonth = (month, year, index) => {
    let elem = document.getElementsByClassName(`${year}`);
    for (let i = 0; i < elem.length; i++) {
      elem[i].className = `month-picker-month ${year}`;
    }
    document.getElementById(
      month
    ).className = `month-picker-month active ${year}`;
    document.querySelector(".datepicker-dropdown").style.display = "none";

    props.getDate({ yearMonth: moment([year, index]).format("YYYY-MM") });
    props.noDates(false);
    props.resetDates(false);
  };

  return (
    <React.Fragment>
      <div className="date-picker-nav-buttons">
        <NavButton
          onClick={() => {
            year > currentYear && year--;
            setyear(year);
            handleMonthBehaviour(isFirstLoad);
          }}
        >
          {/* <img src="/themes/custom/solm/images/solmar_arrow_left.svg"/> */}
        </NavButton>
        <NavButton
          onClick={() => {
            year++ && setyear(year);
            handleMonthBehaviour(isFirstLoad);
          }}
        >
          {/* <img src="/themes/custom/solm/images/solmar_arrow.svg"/> */}
        </NavButton>
      </div>

      <div className="date-picker-title">{year}</div>

      <div
        css={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: `repeat(3, auto)`,
          gridTemplateRows: `repeat(4, auto)`,
          justifyContent: "start",
        }}
        className="month-picker-months"
      >
        {months.map((month, index) => {
          return (
            <button
              id={month.month}
              key={month.month}
              disabled={month.isDisable}
              onClick={() => handleMonth(month.month, year, index)}
              className={`month-picker-month ${year}`}
            >
              {month.month}
            </button>
          );
        })}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return { date: state.date };
};

export default connect(mapStateToProps, { getDate, noDates, resetDates })(
  MonthFilter
);
