import React, { useState } from "react";
import PropTypes from "prop-types";

const TimeTable = ({ offset, selected, onChange, onHover }) => {
  const [hoverY, setHoverY] = useState(-1);

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
        const hour = (offset + i) % 24;
        return (
          <div key={hour} className="px-1" onClick={(e) => onChange(hour)}>
            <div className="w-12 text-right">{hour}:00</div>
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
