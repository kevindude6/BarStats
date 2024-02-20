import React from "react";
import { msToString } from "../helper/timeFuncs";
import { bin } from "d3-array";
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from "recharts";

export const MapStatsOverview = (props) => {
  const { data } = props;
  if (data.hasData === false) return <p> no data :c </p>;

  /*const thresholdTime = (n) => {
    return (data, min, max) => {
      return scaleUtc().domain([min, max]).ticks(n);
    };
  };*/

  const getMapDateBins = (map) => {
    //const binner = bin().thresholds(5);
    //const bins = binner(map.startTimes);
    const dates = {};
    map.startTimes.forEach((time) => {
      const dateString = time.toLocaleDateString("en-GB");
      if (!(dateString in dates)) dates[dateString] = 0;
      dates[dateString] += 1;
    });
    const output = Object.keys(dates).map((k) => ({ date: k, count: dates[k] }));
    return output;
  };
  const createMapArea = (map) => {
    const durStat = map.durationStats;
    const bins = getMapDateBins(map);
    return (
      <div key={map.cleanName} className="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-xl font-medium">
          {map.cleanName} - {map.wins}/{map.count}
        </div>
        <div className="collapse-content w-full prose max-w-none">
          <div className="flex w-full">
            <div className="flex-grow basis-1/3">
              <h4>Average game length: </h4>
              <span>{msToString(durStat.mean)}</span>
              <h4>Median game length: </h4>
              <p>{msToString(durStat.median)}</p>
              <h4>Game length variance: </h4>
              <p>{durStat.variance}</p>
              <h4>Game length deviation: </h4>
              <p>{durStat.deviation}</p>
              <h4>Game length lower quartile: </h4>
              <p>{msToString(durStat.lowerQuartile)}</p>
              <h4>Game length upper quartile: </h4>
              <p>{msToString(durStat.upperQuartile)}</p>
            </div>
            <div className="flex-grow basis-2/3">
              <ResponsiveContainer>
                <LineChart data={bins}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Map Stats</h2>
        {Object.values(data.mapStats).map((map) => createMapArea(map))}
      </div>
    </div>
  );
};
