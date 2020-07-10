import React from "react";
import PropTypes from "prop-types";

const getTimeClasses = (time) => {
  const hour = parseInt(time.split(":")[0]);
  if (hour < 7 || hour > 20) {
    return "bg-gray-400";
  } else return "bg-white";
};

const TimeTable = ({ interval, onClick, onMouseMove, onMouseDown }) => {
  const chunks = interval.splitBy({ hours: 1 }).map((i) => i.start);

  return (
    <div className="w-full text-sm border border-gray-500 select-none cursor-pointer">
      {chunks.map((d, idx) => {
        const time = d.toFormat("HH:mm");
        return (
          <div
            key={idx}
            className={"px-1 " + getTimeClasses(time)}
            onClick={(e) => onClick(d, e)}
            onMouseMove={(e) => onMouseMove(d, e)}
            onMouseDown={(e) => onMouseDown(d, e)}
          >
            <div className="w-12 text-right">{time}</div>
          </div>
        );
      })}
    </div>
  );
};

TimeTable.propTypes = {
  interval: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
};

export default TimeTable;
