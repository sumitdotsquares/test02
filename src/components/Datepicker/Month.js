/** @jsx jsx */
import { useMonth } from "@datepicker-react/hooks";
import { jsx } from "@emotion/core";
import Day from "./Day";
import moment from "moment";

function Month({ year, month, firstDayOfWeek }) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek
  });

  // let previousDay = new Date();
  // previousDay.setDate(previousDay.getDate()+1);
  
  const validateDate = () => {    
    let salesRole = localStorage.getItem('user_role');
    let third_party_agent = localStorage.getItem('third_party_agent');
    if(salesRole === "agent" && third_party_agent !== "true"){
      return moment().subtract(1,'days')._d
    }else {
      return moment().add(1,'days')._d;
    }
  }

  return (
    <div
      className={"month-" + moment(monthLabel).format("MMMM-YYYY")}
    >
      <div className="date-picker-title">
        {monthLabel}
      </div>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center"
        }}
      >
        {weekdayLabels.map(dayLabel => (
          <div className="dayLabel" css={{ textAlign: "center" }} key={dayLabel}>
            {dayLabel}
          </div>
        ))}
      </div>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center"
        }}
      >
          
        {days.map((day, index) => {
          if (typeof day === "object") {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
                isValid={day.date > validateDate() ? true : false}
              />
            );
          }

          return <div key={index} />;
        })}
      </div>
    </div>
  );
}

export default Month;
