import React, { Component } from "react";
import classNames from "classnames";
import { DateTime, IANAZone } from "luxon";

import TimeTable from "../components/TimeTable";
import LocationSearch from "../components/LocationSearch";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yAxis: -1,
      locations: [DateTime.local().zoneName],
      blockOriginTop: -1,
      blockOriginBottom: -1,
      blockTop: -1,
      blockBottom: -1,
    };
  }

  addLocation = (value) => {
    const locations = this.state.locations.concat([value]);
    this.setState({ locations });
    const zone = new IANAZone(value);
    console.log(value, locations, zone);
  };

  handleTimeTableClick = (tz, time, e) => {
    this.setState({ blockBottom: this.state.blockOriginBottom });
  };

  handleTimeTableMouseDown = (tz, time, e) => {
    const parentTop = e.currentTarget.offsetParent.getBoundingClientRect().top;
    const { bottom, top } = e.currentTarget.getBoundingClientRect();
    const blockOriginTop = top - parentTop;
    const blockOriginBottom = bottom - parentTop;
    this.setState({
      blockOriginTop,
      blockOriginBottom,
      blockTop: blockOriginTop,
      blockBottom: blockOriginTop,
    });
    console.log(tz, time);
  };

  handleTimeTableMouseMove = (tz, time, e) => {
    const parentTop = e.currentTarget.offsetParent.getBoundingClientRect().top;
    const { bottom, top } = e.currentTarget.getBoundingClientRect();
    const yAxis = e.clientY - parentTop;
    const state = {
      yAxis,
    };

    // left mouse button is down - dragging a block
    if (e.buttons === 1) {
      const { blockOriginTop, blockOriginBottom } = this.state;
      if (yAxis >= blockOriginTop) {
        state.blockTop = blockOriginTop;
        state.blockBottom = bottom - parentTop;
      } else {
        state.blockBottom = blockOriginBottom;
        state.blockTop = top - parentTop;
      }
    }
    this.setState(state);
  };

  handleTimeTableMouseOut = () => {
    this.setState({ yAxis: -1 });
  };

  render() {
    const { locations, yAxis, blockTop, blockBottom } = this.state;
    const baseOffset = DateTime.local().setZone(locations[0]).offset;

    return (
      <div className="flex justify-center md:pt-8">
        <div className="w-full md:max-w-6xl shadow-lg md:rounded-md bg-white">
          <header className="bg-blue-300 md:rounded-t-md px-8 py-6 flex justify-between items-center">
            <h1 className="text-4xl">World Clock</h1>
            <div className="w-64">
              <LocationSearch onChange={this.addLocation} />
            </div>
          </header>
          <main className="p-4">
            <div className="flex mb-4">
              {locations.map((value, idx) => (
                <div key={idx} className="w-full text-xl px-2 truncate">
                  {value}
                </div>
              ))}
            </div>
            <div
              className="flex relative border border-gray-500"
              onMouseOut={this.handleTimeTableMouseOut}
            >
              {locations.map((value, idx) => {
                const relativeOffset = value
                  ? DateTime.local().setZone(value).offset - baseOffset
                  : 0;
                return (
                  <TimeTable
                    key={idx}
                    onClick={this.handleTimeTableClick.bind(this, value)}
                    onMouseMove={this.handleTimeTableMouseMove.bind(
                      this,
                      value
                    )}
                    onMouseDown={this.handleTimeTableMouseDown.bind(
                      this,
                      value
                    )}
                    offset={relativeOffset}
                  />
                );
              })}
              <div
                className={classNames(
                  "absolute z-50 w-full border-b border-gray-600 pointer-events-none",
                  { hidden: yAxis < 0 }
                )}
                style={{ top: yAxis }}
              />
              <div
                className={classNames(
                  "absolute w-full bg-blue-500 bg-opacity-25 pointer-events-none",
                  { hidden: blockTop < 0 }
                )}
                style={{
                  top: blockTop,
                  height: `${blockBottom - blockTop}px`,
                }}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
