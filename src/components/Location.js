import React from "react";
import PropTypes from "prop-types";

import Timetable from "./TimeTable";
import TimezoneSelector from "./TimezoneSelector";

const Location = ({ value, offset, setTime, setLocation }) => {
  return (
    <div className="max-w-xs">
      <TimezoneSelector value={value} onChange={setLocation} />
      {!!value && <Timetable onChange={setTime} offset={offset} />}
    </div>
  );
};

Location.propTypes = {
  value: PropTypes.string,
  offset: PropTypes.number,
  setLocation: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
};

export default Location;
