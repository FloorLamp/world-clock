import React, { Component } from "react";
import { DateTime } from "luxon";

import Location from "../components/Location";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [DateTime.local().zoneName],
    };
  }

  setLocation = (idx, value) => {
    const locations = this.state.locations
      .slice(0, idx)
      .concat([value])
      .concat(this.state.locations.slice(idx + 1));
    this.setState({ locations });
    console.log(idx, value, locations);
  };

  setTime = (locIdx, time) => {
    console.log(this.state.locations[locIdx], time);
  };

  render() {
    const { locations } = this.state;
    const len = locations.length;

    return (
      <div className="flex justify-center md:pt-8">
        <div className="w-full md:max-w-4xl shadow-lg md:rounded-md bg-white">
          <header className="bg-blue-300 md:rounded-t-md px-8 py-6">
            <h1 className="text-4xl">World Clock</h1>
          </header>
          <main className="flex p-4">
            {locations.map((value, idx) => (
              <Location
                key={idx}
                setLocation={this.setLocation.bind(this, idx)}
                setTime={this.setTime.bind(this, idx)}
                value={value}
              />
            ))}
            {len === 1 && (
              <Location
                setLocation={this.setLocation.bind(this, len)}
                setTime={this.setTime.bind(this, len)}
              />
            )}
          </main>
        </div>
      </div>
    );
  }
}

export default App;
