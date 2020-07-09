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
    };
  }

  addLocation = (value) => {
    const locations = this.state.locations.concat([value]);
    this.setState({ locations });
    const zone = new IANAZone(value);
    console.log(value, locations, zone);
  };

  setTime = (locIdx, time) => {
    console.log(this.state.locations[locIdx], time);
  };

  handleTimeTableHover = (e) => {
    this.setState({
      yAxis: e.clientY - e.currentTarget.getBoundingClientRect().top,
    });
  };

  handleTimeTableMouseOut = () => {
    this.setState({ yAxis: -1 });
  };

  render() {
    const { locations, yAxis } = this.state;
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
              onMouseMove={this.handleTimeTableHover}
              onMouseOut={this.handleTimeTableMouseOut}
            >
              <div
                className={classNames(
                  "absolute z-50 w-full border-b border-gray-600 pointer-events-none",
                  { hidden: yAxis < 0 }
                )}
                style={{ top: yAxis }}
              />
              {locations.map((value, idx) => {
                const relativeOffset = value
                  ? DateTime.local().setZone(value).offset - baseOffset
                  : 0;
                return (
                  <TimeTable
                    key={idx}
                    onChange={this.setTime.bind(this, idx)}
                    offset={relativeOffset}
                  />
                );
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
