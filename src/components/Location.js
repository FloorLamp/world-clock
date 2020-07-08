import React from "react";
import PropTypes from "prop-types";

import Timetable from "./TimeTable";
import TimezoneSelector from "./TimezoneSelector";

const Location = ({ value, setTime, setLocation }) => {
  return (
    <div className="max-w-xs">
      <TimezoneSelector value={value} onChange={setLocation} />
      <Timetable onChange={setTime} />
    </div>
  );
};

Location.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  setLocation: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
};

export default Location;
