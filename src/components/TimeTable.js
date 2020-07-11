import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const getTimeClasses = (time) => {
  const hour = parseInt(time.split(":")[0]);
  if (hour < 7 || hour > 20) {
    return "bg-gray-300";
  } else return "bg-white";
};

const TimeTable = ({ interval, onClick, onMouseMove, onMouseDown }) => {
  const chunks = interval.splitBy({ hours: 1 }).map((i) => i.start);

  return (
    <div className="w-full h-full text-sm font-medium border border-gray-400 select-none cursor-pointer">
      {chunks.map((d, idx) => {
        const time = d.toFormat("HH:mm");
        const day = d.toLocaleString({
          weekday: "short",
          month: "long",
          day: "2-digit",
        });
        const isDayBoundary = d.hour === 0;

        return (
          <div
            key={idx}
            className={classNames(
              "flex items-center p-px",
              getTimeClasses(time),
              { "border-t": isDayBoundary, "border-gray-400": isDayBoundary }
            )}
            onClick={(e) => onClick(d, e)}
            onMouseMove={(e) => onMouseMove(d, e)}
            onMouseDown={(e) => onMouseDown(d, e)}
          >
            <div className="w-12 text-right text-gray-900">{time}</div>
            {isDayBoundary && (
              <div className="ml-2 text-gray-600 uppercase text-xs">{day}</div>
            )}
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
