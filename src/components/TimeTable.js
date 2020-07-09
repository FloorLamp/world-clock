import React, { useState } from "react";
import PropTypes from "prop-types";

const displayMinutes = (n) => {
  const str = n.toString();
  return str.length === 1 ? "0" + str : str;
};

const TimeTable = ({ offset, selected, onChange, onHover }) => {
  const [hoverY, setHoverY] = useState(-1);
  const startingHour = Math.floor(offset / 60);
  const minutes = displayMinutes(((offset % 60) + 60) % 60);

  return (
    <div
      className="text-sm border border-gray-400 divide-y divide-gray-200 select-none cursor-pointer relative"
      onMouseMove={(e) => {
        setHoverY(e.clientY - e.currentTarget.getBoundingClientRect().top);
      }}
      onMouseOut={(e) => setHoverY(-1)}
    >
      <div
        className="absolute w-full border-b border-gray-400 pointer-events-none"
        style={{ top: hoverY }}
      ></div>
      {Array.from({ length: 24 }).map((_, i) => {
        const hour = (startingHour + i + 24) % 24;
        const time = `${hour}:${minutes}`;
        return (
          <div key={hour} className="px-1" onClick={(e) => onChange(time)}>
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
  onHover: PropTypes.func,
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TimeTable;
