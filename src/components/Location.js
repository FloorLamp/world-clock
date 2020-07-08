import React from "react";
import PropTypes from "prop-types";

import Timetable from "./TimeTable";
import TimezoneSelector from "./TimezoneSelector";

const Location = ({ defaultValue }) => {
  return (
    <div className="p-4 max-w-xs">
      <TimezoneSelector defaultValue={defaultValue} />
      <Timetable />
    </div>
  );
};

Location.propTypes = { defaultValue: PropTypes.string };

export default Location;
