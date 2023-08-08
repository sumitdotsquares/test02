/** @jsx jsx */
import { useRef, useContext } from "react";
import { useDay } from "@datepicker-react/hooks";
import { jsx } from "@emotion/core";
import DatepickerContext from "./datepickerContext";
import getColor from "./utils/getColor";

function Day({ dayLabel, date, isValid }) {
  const dayRef = useRef(null);
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover
  } = useContext(DatepickerContext);
  let {
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    disabledDate,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef
  });

  if (!dayLabel) {
    return <div />;
  }

  const getColorFn = getColor(
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    disabledDate,
    !isValid
  );

  const handleClick = () => {
    onClick();
    document.querySelector(".datepicker-dropdown").style.display = "none";
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      disabled={!isValid}
      type="button"
      ref={dayRef}
      className={"day-picker-day day-" + dayLabel}
      css={{
        border: 0,
        color: getColorFn({
          selectedFirstOrLastColor: "#001217",
          normalColor: "#001217",
          selectedColor: "#001217",
          rangeHoverColor: "#001217",
          disabledColor: "#808285"
        }),
        background: getColorFn({
          selectedFirstOrLastColor: "#fbe1ec",
          normalColor: "#FFFFFF",
          selectedColor: "#fbe1ec",
          rangeHoverColor: "#fbe1ec",
          disabledColor: "#FFFFFF"
        })
      }}
    >
      {dayLabel}
    </button>
  );
}

export default Day;
