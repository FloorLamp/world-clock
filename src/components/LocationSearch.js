import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import tzdata from "tzdata";

const TIMEZONES = Array.from(Object.keys(tzdata.zones)).sort();

class LocationSearch extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      matches: [],
      hoveredIdx: -1,
      selectedIdx: 0,
      value: "",
    };
  }

  onChange = (e) => {
    const value = e.target.value;
    let matches = [];
    if (value) {
      let re;
      try {
        re = new RegExp(value, "ig");
      } catch (error) {
        console.error("invalid search input", value);
        return;
      }
      matches = TIMEZONES.filter((tz) => !!tz.match(re));
    }
    this.setState({ isActive: true, value, matches });
  };

  onKeyDown = (e) => {
    const { matches, selectedIdx } = this.state;
    switch (e.keyCode) {
      case 13: // ENTER
        this.handleSelect(matches[selectedIdx]);
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
      case 27: // ESC
        this.handleClose();
        break;
      default:
        break;
    }
  };

  onHover = (i) => {
    this.setState({ hoveredIdx: i });
  };

  handleSelect = (value) => {
    let realValue = value;
    if (typeof tzdata.zones[value] === "string") {
      realValue = tzdata.zones[value];
    }
    this.setState({ value: "", isActive: false, matches: [] });
    this.props.onChange(realValue);
  };

  handleClose = () => {
    this.setState({ isActive: false });
  };

  render() {
    const { isActive, value, matches, hoveredIdx, selectedIdx } = this.state;
    return (
      <>
        {isActive && (
          <div
            className="absolute z-40 w-full h-full inset-0"
            onClick={this.handleClose}
          />
        )}
        <div className="w-full relative">
          <input
            type="text"
            className="w-full border border-transparent rounded px-2 py-1 text-lg focus:outline-none focus:border-gray-600 hover:border-gray-600 focus:shadow"
            placeholder="Add a location..."
            value={value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
          />
          <div
            className={classNames(
              "absolute z-50 bg-white h-40 max-w-md w-full overflow-y-scroll border border-gray-600",
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
                onClick={this.handleSelect.bind(this, tz)}
              >
                {tz}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default LocationSearch;
