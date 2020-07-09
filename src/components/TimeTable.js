import React from "react";
import PropTypes from "prop-types";

const displayMinutes = (n) => {
  const str = n.toString();
  return str.length === 1 ? "0" + str : str;
};

const getHourClasses = (hour) => {
  if (hour < 7 || hour > 20) {
    return "bg-gray-400";
  } else return "bg-white";
};

const TimeTable = ({ offset, onChange }) => {
  const startingHour = Math.floor(offset / 60);
  const minutes = displayMinutes(((offset % 60) + 60) % 60);

  return (
    <div className="w-full text-sm border border-gray-500 select-none cursor-pointer">
      {Array.from({ length: 24 }).map((_, i) => {
        const hour = (startingHour + i + 24) % 24;
        const time = `${hour}:${minutes}`;
        return (
          <div
            key={hour}
            className={"px-1 " + getHourClasses(hour)}
            onClick={(e) => onChange(time)}
          >
            <div className="w-12 text-right">{time}</div>
          </div>
        );
      })}
    </div>
  );
};

TimeTable.defaultProps = { offset: 0 };

TimeTable.propTypes = {
  offset: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default TimeTable;
