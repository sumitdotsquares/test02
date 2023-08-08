export default function getColor(
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    isDisabled,
    isValid
  ) {
    return ({
      selectedFirstOrLastColor,
      normalColor,
      selectedColor,
      rangeHoverColor,
      disabledColor
    }) => {
      if (isSelectedStartOrEnd) {
        return selectedFirstOrLastColor;
      } else if (isSelected) {
        return selectedColor;
      } else if (isWithinHoverRange) {
        return rangeHoverColor;
      } else if (isDisabled) {
        return disabledColor;
      } else if (isValid) {
        return disabledColor;
      } else {
        return normalColor;
      }
    };
  }
  