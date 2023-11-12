import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const DateRangePickerComponent = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  startDate: string;
  endDate: string;
  setStartDate: Function;
  setEndDate: Function;
}) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    // Format the dates and call the passed in onDateChange function
    if (startDate === endDate) {
      return;
    }

    setState([ranges.selection]);
    setStartDate(format(startDate, "yyyy-MM-dd"));
    setEndDate(format(endDate, "yyyy-MM-dd"));
  };

  return (
    <DateRangePicker
      onChange={handleSelect}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction="horizontal"
    />
  );
};

export default DateRangePickerComponent;
