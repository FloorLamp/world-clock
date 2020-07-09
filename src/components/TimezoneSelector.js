import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import tzdata from "tzdata";

const TIMEZONES = Array.from(Object.keys(tzdata.zones)).sort();

class TimezoneSelector extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      matches: [],
      hoveredIdx: -1,
      selectedIdx: 0,
      searchValue: props.value || "",
    };
  }

  onChange = (e) => {
    const searchValue = e.target.value;
    let matches = [];
    if (searchValue) {
      let re;
      try {
        re = new RegExp(searchValue, "ig");
      } catch (error) {
        console.error("invalid search input", searchValue);
        return;
      }
      matches = TIMEZONES.filter((tz) => !!tz.match(re));
    }
    this.setState({ isActive: true, searchValue, matches });
  };

  onKeyDown = (e) => {
    const { matches, selectedIdx } = this.state;
    switch (e.keyCode) {
      case 13: // ENTER
        this.onSelect(matches[selectedIdx]);
        break;
      case 38: // UP
        this.setState({
          selectedIdx: Math.max(0, selectedIdx - 1),
        });
        break;
      case 40: // DOWN
        this.setState({
          selectedIdx: Math.min(matches.length - 1, selectedIdx + 1),
        });
        break;
      default:
        break;
    }
  };

  onHover = (i) => {
    this.setState({ hoveredIdx: i });
  };

  onSelect = (value) => {
    let realValue = value;
    if (typeof tzdata.zones[value] === "string") {
      realValue = tzdata.zones[value];
    }
    this.setState({ searchValue: realValue, isActive: false });
    this.props.onChange(realValue);
  };

  render() {
    const {
      isActive,
      searchValue,
      matches,
      hoveredIdx,
      selectedIdx,
    } = this.state;
    return (
      <div className="relative mb-4">
        <label className="block uppercase text-gray-700 font-bold text-xs mb-2">
          Location
        </label>
        <input
          type="text"
          className="w-full border border-transparent rounded px-4 py-3 text-lg focus:outline-none focus:border-gray-600 hover:border-gray-600 focus:shadow"
          placeholder="Enter a location..."
          value={searchValue}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        <div
          className={classNames(
            "absolute z-10 bg-white h-40 max-w-md w-full overflow-y-scroll border border-gray-600",
            {
              block: isActive,
              hidden: !isActive,
            }
          )}
          onMouseOut={this.onHover.bind(this, -1)}
        >
          {matches.map((tz, i) => (
            <div
              key={tz}
              className={classNames("cursor-pointer px-2 py-1", {
                "bg-blue-500": selectedIdx === i,
                "bg-blue-300": hoveredIdx === i,
              })}
              onMouseEnter={this.onHover.bind(this, i)}
              onClick={this.onSelect.bind(this, tz)}
            >
              {tz}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default TimezoneSelector;
