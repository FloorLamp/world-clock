import React from "react";
import { DateTime } from "luxon";

import Location from "../components/Location";

function App() {
  const localTz = DateTime.local().zoneName;

  return (
    <div className="flex justify-center md:pt-8">
      <div className="w-full md:max-w-4xl shadow-lg md:rounded-md bg-white">
        <header className="bg-blue-300 md:rounded-t-md px-8 py-6">
          <h1 className="text-4xl">World Clock</h1>
        </header>
        <main>
          <Location defaultValue={localTz} />
        </main>
      </div>
    </div>
  );
}

export default App;
