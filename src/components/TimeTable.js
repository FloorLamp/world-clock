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
  const hours = interval.splitBy({ hours: 1 }).map((i) => i.start);

  return (
    <div className="w-full h-full text-sm font-medium border border-gray-400 select-none cursor-pointer">
      {hours.map((curr, idx) => {
        const time = curr.toFormat("HH:mm");
        const day = curr.toLocaleString({
          weekday: "short",
          month: "long",
          day: "2-digit",
        });
        const isDayBoundary = curr.hour === 0;

        let dstBoundary = null;
        if (idx > 0) {
          const prev = hours[idx - 1];
          if (curr.isInDST !== prev.isInDST) {
            dstBoundary = curr.isInDST;
          }
        }

        return (
          <div
            key={idx}
            className={classNames(
              "flex items-center p-px",
              getTimeClasses(time),
              { "border-t": isDayBoundary, "border-gray-400": isDayBoundary }
            )}
            onClick={(e) => onClick(curr, e)}
            onMouseMove={(e) => onMouseMove(curr, e)}
            onMouseDown={(e) => onMouseDown(curr, e)}
          >
            <div
              className={classNames("w-12 text-right text-gray-900", {
                "text-red-700": dstBoundary != null,
              })}
            >
              {time}
            </div>
            {isDayBoundary && (
              <div className="ml-2 text-gray-600 uppercase text-xs">{day}</div>
            )}
            {dstBoundary != null && (
              <div className="ml-2 text-red-600 uppercase text-xs">
                {dstBoundary ? "DST Starts" : "DST Ends"}
              </div>
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
