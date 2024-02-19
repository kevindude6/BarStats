import React from "react";
import { msToString } from "../helper/timeFuncs";

export const MapStatsOverview = (props) => {
  const { data } = props;
  if (data.hasData === false) return <p> no data :c </p>;

  const createMapArea = (map) => {
    const durStat = map.durationStats;
    return (
      <div className="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-xl font-medium">
          {map.cleanName} - {map.wins}/{map.count}
        </div>
        <div className="collapse-content prose">
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
