import React from "react";

const TimeTable = ({ startingHour = 0, onHover, selected, onSelect }) => {
  return (
    <div className="text-sm border border-gray-400 divide-y divide-gray-200 select-none cursor-pointer">
      {Array.from({ length: 24 }).map((_, i) => {
        const hour = (startingHour + i) % 24;
        return (
          <div
            key={hour}
            className="px-1"
            onClick={(e) => onSelect(e, hour)}
            onMouseMove={onHover}
          >
            <div className="w-12 text-right">{hour}:00</div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeTable;
