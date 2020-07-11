import React, { Component } from "react";
import classNames from "classnames";
import { DateTime, Interval } from "luxon";

import TimeTable from "../components/TimeTable";
import LocationSearch from "../components/LocationSearch";

const formatInterval = (start, end) => {
  if (start.day === end.day) {
    return `${start.toLocaleString(
      DateTime.DATETIME_SHORT
    )} – ${end.toLocaleString(DateTime.TIME_SIMPLE)}`;
  } else {
    return `${start.toLocaleString(
      DateTime.DATETIME_SHORT
    )} – ${end.toLocaleString(DateTime.DATETIME_SHORT)}`;
  }
};

export class App extends Component {
  constructor(props) {
    super(props);

    const today = DateTime.local().startOf("day");

    this.state = {
      yAxis: -1,
      locations: [today.zoneName],
      viewportStart: today,
      viewportEnd: today.plus({ hours: 48 }),
      blockOriginTime: null,
      blockStartTime: null,
      blockEndTime: null,
      blockOriginTop: -1,
      blockOriginBottom: -1,
      blockTop: -1,
      blockBottom: -1,
    };
  }

  handleAddLocation = (value) => {
    const locations = this.state.locations.concat([value]);
    this.setState({ locations });
  };

  handleRemoveLocation = (idx) => {
    this.setState({
      locations: this.state.locations
        .slice(0, idx)
        .concat(this.state.locations.slice(idx + 1)),
    });
  };

  handleTimeTableClick = (tz, time, e) => {
    this.setState({
      blockBottom: this.state.blockOriginBottom,
      blockStartTime: time,
      blockEndTime: time.plus({ hour: 1 }),
    });
  };

  handleTimeTableMouseDown = (tz, time, e) => {
    const parentTop =
      e.currentTarget.offsetParent.getBoundingClientRect().top -
      e.currentTarget.offsetParent.scrollTop;
    const { bottom, top } = e.currentTarget.getBoundingClientRect();
    const blockOriginTop = top - parentTop;
    const blockOriginBottom = bottom - parentTop;
    this.setState({
      blockStartTime: time,
      blockOriginTime: time,
      blockOriginTop,
      blockOriginBottom,
      blockTop: blockOriginTop,
      blockBottom: blockOriginTop,
    });
  };

  handleTimeTableMouseMove = (tz, time, e) => {
    const parentTop =
      e.currentTarget.offsetParent.getBoundingClientRect().top -
      e.currentTarget.offsetParent.scrollTop;
    const { bottom, top } = e.currentTarget.getBoundingClientRect();
    const yAxis = e.clientY - parentTop;
    const state = {
      yAxis,
    };

    // left mouse button is down - dragging a block
    if (e.buttons === 1) {
      const { blockOriginTop, blockOriginBottom, blockOriginTime } = this.state;
      if (yAxis >= blockOriginTop) {
        state.blockTop = blockOriginTop;
        state.blockBottom = bottom - parentTop;

        state.blockStartTime = blockOriginTime;
        state.blockEndTime = time.plus({ hour: 1 });
      } else {
        state.blockTop = top - parentTop;
        state.blockBottom = blockOriginBottom;

        state.blockStartTime = time;
        state.blockEndTime = blockOriginTime.plus({ hour: 1 });
      }
    }
    this.setState(state);
  };

  handleTimeTableMouseOut = () => {
    this.setState({ yAxis: -1 });
  };

  handleScroll = ({ target }) => {
    if (target.scrollTop > target.scrollHeight - target.clientHeight - 50) {
      const viewportEnd = this.state.viewportEnd.plus({ hours: 24 });
      console.log("add 24h", viewportEnd.toISO());
      this.setState({
        viewportEnd,
      });
    }
  };

  render() {
    const {
      viewportStart,
      viewportEnd,
      locations,
      yAxis,
      blockTop,
      blockBottom,
      blockStartTime,
      blockEndTime,
    } = this.state;
    const interval = Interval.fromDateTimes(viewportStart, viewportEnd);

    return (
      <div className="flex justify-center h-auto">
        <div className="w-full xl:max-w-screen-xl xl:shadow-lg bg-white">
          <header className="bg-green-300 px-8 py-6 flex justify-between items-center">
            <h1 className="text-4xl">World Clock</h1>
            <div className="w-64">
              <LocationSearch onChange={this.handleAddLocation} />
            </div>
          </header>
          <main className="p-4">
            {locations.length ? (
              <>
                <div className="flex mb-4">
                  {locations.map((value, idx) => (
                    <div key={idx} className="w-full pl-2 truncate group">
                      <div className="relative justify-between">
                        <h2 className="text-xl max-w-full">{value}</h2>
                        <button
                          className="absolute inset-y-0 right-0 bg-white rounded-full px-2 text-red-700 font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
                          onClick={this.handleRemoveLocation.bind(this, idx)}
                        >
                          &times;
                        </button>
                      </div>
                      <h3 className="block">
                        {!!blockStartTime && !!blockEndTime ? (
                          formatInterval(
                            blockStartTime.setZone(value),
                            blockEndTime.setZone(value)
                          )
                        ) : (
                          <>&#8203;</>
                        )}
                      </h3>
                    </div>
                  ))}
                </div>
                <div
                  className="flex relative border border-gray-500 overflow-y-scroll"
                  style={{ maxHeight: "557px" }}
                  onMouseOut={this.handleTimeTableMouseOut}
                  onScroll={this.handleScroll}
                >
                  {locations.map((value, idx) => {
                    const thisInterval = interval.mapEndpoints((d) =>
                      d.setZone(value)
                    );
                    return (
                      <TimeTable
                        key={idx}
                        interval={thisInterval}
                        onClick={this.handleTimeTableClick.bind(this, value)}
                        onMouseMove={this.handleTimeTableMouseMove.bind(
                          this,
                          value
                        )}
                        onMouseDown={this.handleTimeTableMouseDown.bind(
                          this,
                          value
                        )}
                      />
                    );
                  })}
                  <div
                    className={classNames(
                      "absolute z-50 w-full border-b border-gray-400 pointer-events-none",
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
              </>
            ) : (
              <div className="h-64 flex justify-center items-center">
                <h2>Add a location to get started</h2>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }
}

export default App;
